const clientIO=io("http://localhost:3000/",{
    auth:{
        authoriztion:"System eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGI1ODVkZmYxZDA5NzAzMzAyZWE2ODQiLCJpYXQiOjE3NTg5MDA2MjAsImV4cCI6MTc1ODkwNDIyMCwianRpIjoiNzNmYjZlYzctMWRjMy00MTU1LTg2NzQtZWZjNGRlNmNiZDQxIn0.aAsvBvIwBf30JaYJWG4uV9TZsL6GYT2WIGubmRDDau0"
    }
})

// متغيرات للتحكم في الـ typing
let typingTimer;
let isTyping = false;
const TYPING_TIMEOUT = 3000; // 3 ثواني

// قائمة المستخدمين المتصلين
const onlineUsers = new Map();

clientIO.on("connect",(data)=>{
    console.log("connection established" +clientIO.id);
    addMessage("Connected to server", "system");
})

clientIO.on("connect_error",(error)=>{
    console.log(error.message);
    addMessage("Connection error: " + error.message, "system");
})

// استقبال events الـ online/offline
clientIO.on("user_online", (data) => {
    console.log("User came online:", data);
    onlineUsers.set(data.userId, {
        ...data.user,
        isOnline: true
    });
    updateOnlineUsersList();
    addMessage(`${data.user.firstName} ${data.user.lastName} came online`, "system");
});

clientIO.on("user_offline", (data) => {
    console.log("User went offline:", data);
    onlineUsers.set(data.userId, {
        ...data.user,
        isOnline: false
    });
    updateOnlineUsersList();
    addMessage(`${data.user.firstName} ${data.user.lastName} went offline`, "system");
});

// استقبال typing events
clientIO.on("typing_status", (data) => {
    console.log("Typing status:", data);
    showTypingIndicator(data);
});

// استقبال الرسائل الجديدة
clientIO.on("newMessage", (data) => {
    console.log("New message:", data);
    addMessage(data.content, "received", data.from);
});

clientIO.on("successMessage", (data) => {
    console.log("Message sent successfully:", data);
    addMessage(data.content, "sent");
});

// إرسال رسالة
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        // إرسال الرسالة (يمكنك تعديل chatId حسب الحاجة)
        clientIO.emit("sendMessage", {
            content: message,
            sendTo: "68b585dff1d09703302ea684" // يمكن تغيير هذا حسب الحاجة
        });
        
        messageInput.value = '';
        stopTyping();
    }
}

// بدء الكتابة
function startTyping() {
    if (!isTyping) {
        isTyping = true;
        clientIO.emit("typing", {
            chatId: "current_chat", // يمكن تغيير هذا حسب الحاجة
            isTyping: true
        });
    }
    
    clearTimeout(typingTimer);
    typingTimer = setTimeout(stopTyping, TYPING_TIMEOUT);
}

// إيقاف الكتابة
function stopTyping() {
    if (isTyping) {
        isTyping = false;
        clientIO.emit("typing", {
            chatId: "current_chat", // يمكن تغيير هذا حسب الحاجة
            isTyping: false
        });
    }
}

// إضافة رسالة إلى الشات
function addMessage(content, type, user = null) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    let messageClass = '';
    let prefix = '';
    
    switch(type) {
        case 'sent':
            messageClass = 'background-color: #dcf8c6; text-align: right;';
            prefix = 'You: ';
            break;
        case 'received':
            messageClass = 'background-color: #ffffff;';
            prefix = user ? `${user.firstName} ${user.lastName}: ` : 'User: ';
            break;
        case 'system':
            messageClass = 'background-color: #f0f0f0; text-align: center; font-style: italic;';
            prefix = '';
            break;
    }
    
    messageDiv.style.cssText = `margin: 5px 0; padding: 8px; border-radius: 8px; ${messageClass}`;
    messageDiv.textContent = prefix + content;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// تحديث قائمة المستخدمين المتصلين
function updateOnlineUsersList() {
    const onlineUsersList = document.getElementById('onlineUsersList');
    onlineUsersList.innerHTML = '';
    
    onlineUsers.forEach((user, userId) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-status';
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = `status-indicator ${user.isOnline ? 'online' : 'offline'}`;
        
        userDiv.appendChild(statusIndicator);
        userDiv.appendChild(document.createTextNode(`${user.firstName} ${user.lastName}`));
        
        onlineUsersList.appendChild(userDiv);
    });
}

// عرض مؤشر الكتابة
function showTypingIndicator(data) {
    const typingIndicator = document.getElementById('typingIndicator');
    
    if (data.isTyping) {
        typingIndicator.textContent = `${data.userName} is typing...`;
        typingIndicator.style.display = 'block';
        
        // إخفاء المؤشر بعد 3 ثواني
        setTimeout(() => {
            typingIndicator.style.display = 'none';
        }, 3000);
    } else {
        typingIndicator.style.display = 'none';
    }
}

// إضافة event listeners
document.getElementById('messageInput').addEventListener('input', startTyping);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// إرسال sayHi للاختبار
clientIO.emit("sayHi","FE to BE")
clientIO.on("sayHi",(data)=>{
    console.log({data});
    addMessage("Server response: " + data, "system");
})
