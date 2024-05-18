//Creating user Api app
const express = require("express");
const userApp = express.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require("../middleWares/verifyToken");

//Get usersCollection into this API
let usersCollection;
let articlesCollection;
userApp.use((request, response, next) => {
  usersCollection = request.app.get("usersCollection");
  articlesCollection = request.app.get("articlesCollection");
  next();
});

//User registration route
userApp.post(
  "/newUser",
  expressAsyncHandler(async (request, response) => {
    //Get newUser resource from client
    const newUser = request.body;
    //Check for duplicate user based on username
    const dbRes = await usersCollection.findOne({ userName: newUser.userName });
    //If user found in DB
    if (dbRes !== null) {
      response.send({
        message: "User already exists, Please try again with new user name",
      });
    } else {
      //hash the password
      const hashedPassword = await bcryptjs.hash(newUser.password, 7);
      //Replace plain password with hashed password
      newUser.password = hashedPassword;
      //Insert into database
      await usersCollection.insertOne(newUser);
      //Send successful insertion response
      response.send({ message: "New user has been registered!" });
    }
  })
);

//User login route
userApp.post(
  "/login",
  expressAsyncHandler(async (request, response) => {
    //Get userCred Obj
    const userCred = request.body;
    //Check for user name
    const dbUser = await usersCollection.findOne({
      userName: userCred.userName,
    });
    if (dbUser === null) {
      response.send({ message: "Invalid username" });
    } else {
      //Check for password
      const status = bcryptjs
        .compare(userCred.password, dbUser.password)
        .then((status) => {
          if (status === false) {
            response.send({ message: "Invalid password" });
          } else {
            //Create jwt token and encode it
            const signedToken = jsonwebtoken.sign(
              { userName: dbUser.userName },
              process.env.SECRET_KEY1,
              { expiresIn: '1d' }
            );
            //Send response
            response.send({
              message: "Login successful!",
              payload: signedToken,
              user: dbUser,
            });
          }
        });
    }
  })
);

//Get articles of all authors
userApp.get(
  "/viewArticles",
  verifyToken,
  expressAsyncHandler(async (request, response) => {
    //get articles from express app
    const articlesCollection = request.app.get("articlesCollection");

    //Get all articles
    let articlesList = await articlesCollection
      .find({ status: true })
      .toArray();

    //Send response
    response.send({
      message: "These are all the articles",
      payload: articlesList,
    });
  })
);

//Post comments for an article id
userApp.post(
  "/comment/:articleId",
  verifyToken,
  expressAsyncHandler(async (request, response) => {
    //Get article ID
    const articleIdFromUrl = (+request.params.articleId);
    //Get user comment obj
    const userComment = request.body;
    //insert userComment obj to comments array of article by id
    await articlesCollection.updateOne(
      { articleId: articleIdFromUrl },
      { $addToSet: { comments: userComment } }
    );
    //response
    response.send({ message: "Comment posted successfully" });
  })
);

//Export userApp
module.exports = userApp;
