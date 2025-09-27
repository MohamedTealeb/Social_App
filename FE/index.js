const clientIO=io("http://localhost:3000/",{
    auth:{
        authoriztion:"System eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGI1ODVkZmYxZDA5NzAzMzAyZWE2ODQiLCJpYXQiOjE3NTg5MDA2MjAsImV4cCI6MTc1ODkwNDIyMCwianRpIjoiNzNmYjZlYzctMWRjMy00MTU1LTg2NzQtZWZjNGRlNmNiZDQxIn0.aAsvBvIwBf30JaYJWG4uV9TZsL6GYT2WIGubmRDDau0"
    }
})

clientIO.on("connect",(data)=>{

    console.log("connection established" +clientIO.id);
})
clientIO.on("connect_error",(error)=>{

    console.log(error.message);
})
clientIO.emit("sayHi","FE to BE")
clientIO.on("sayHi",(data)=>{
    console.log({data});
})
