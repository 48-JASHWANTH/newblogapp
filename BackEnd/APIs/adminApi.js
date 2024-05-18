//Creating admin Api app
const express = require('express')
const adminApp = express.Router()
const bcryptjs = require('bcryptjs')
const expressAsyncHandler = require('express-async-handler')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

let adminCollection
adminApp.use((request,response,next)=>{
    adminCollection = request.app.get('adminCollection')
    next()
})

adminApp.post('/login',expressAsyncHandler(async(request,response)=>{
    //Get adminCred Obj
    const adminCred = request.body
    //Check for user name
    const dbAdmin = await adminCollection.findOne({adminName:adminCred.adminName})
    if(dbAdmin === null){
        response.send({message:'Invalid adminName'})
    }else{
        //Check for password
        const status = bcryptjs.compare(adminCred.password,dbAdmin.password)
        if(status === false){
            response.send({message:'Invalid password'})
        }else{
            //Create jwt token and encode it
            const signedToken = jsonwebtoken.sign({adminName:dbAdmin.adminName},process.env.SECRET_KEY2,{expiresIn:100})
            //Send response
            response.send({message:'Login successful!',payload:signedToken,admin:dbAdmin})
        }
    }
}))


//Get articles of all authors
adminApp.get('/viewArticles',expressAsyncHandler(async(request,response)=>{
    //get articles from express app
    const articlesCollection = request.app.get('articlesCollection')

    //Get all articles
    let articlesList = await articlesCollection.find().toArray()

    //Send response
    response.send({message:'These are all the articles',payload:articlesList})
}))



//Exporting adminApp
module.exports = adminApp