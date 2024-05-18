//Creating express App
const express = require("express");
const app = express();
require("dotenv").config();
const mongoClient = require('mongodb').MongoClient

const path = require('path')

//deploying react bulid in this server
app.use(express.static(path.join(__dirname,'../FrontEnd/my-app/build')))

//Importing API routes
const userApp = require("./APIs/userApi");
const authorApp = require("./APIs/authorApi");
const adminApp = require("./APIs/adminApi");


//To parse the body of request
app.use(express.json())

//If path starts with userApi, send request to userApp
app.use('/userApi',userApp)

//If path starts with authorApi, send request to authorApp
app.use('/authorApi',authorApp)

//If path starts with adminApi, send request to adminApp
app.use('/adminApi',adminApp)


//Connection to database
mongoClient.connect(process.env.DB_URL)
.then(client =>{
    //Get DB obj
    const blogDb = client.db('blogDb')

    //Get collection objs
    const usersCollection = blogDb.collection('usersCollection')
    const articlesCollection = blogDb.collection('articlesCollection')
    const authorsCollection = blogDb.collection('authorsCollection')
    const adminCollection = blogDb.collection('adminCollection')

    //Share collection objs with express app
    app.set('usersCollection',usersCollection)
    app.set('articlesCollection',articlesCollection)
    app.set('authorsCollection',authorsCollection)
    app.set('adminCollection',adminCollection)
    
    //Confirm DB connection status
    console.log("DB connection success!")
})
.catch(err=>console.log("Error in DB connection",err))

app.use((request,response,next)=>{
    response.sendFile(path.join(__dirname,'../FrontEnd/my-app/build/index.html'))
})

//express error handler
app.use((error,request,response,next)=>{
    response.send({message:'error',payload:error.message})
})

//Assign port number
const port = process.env.PORT || 7777;
app.listen(port, () => console.log(`Web server running on port ${port}`));