const clientIO=io("http://localhost:3000/")

clientIO.on("connect",(data)=>{

    console.log("connection established" +clientIO.id);
})
clientIO.emit("sayHi","FE to BE")
clientIO.on("sayHi",(data)=>{
    console.log({data});
})
