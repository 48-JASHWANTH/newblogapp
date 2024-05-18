//Creating author Api app
const express = require("express");
const authorApp = express.Router();
const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require("../middleWares/verifyToken");

let authorsCollection;
let articlesCollection;
authorApp.use((request, response, next) => {
  authorsCollection = request.app.get("authorsCollection");
  articlesCollection = request.app.get("articlesCollection");
  next();
});

//Author registration
authorApp.post(
  "/newAuthor",
  expressAsyncHandler(async (request, response) => {
    //Get newAuthor resource from client
    const newAuthor = request.body;
    //Check for duplicate user based on username
    const dbRes = await authorsCollection.findOne({
      userName: newAuthor.userName,
    });
    //If user found in DB
    if (dbRes !== null) {
      response.send({
        message: "Author already exists, Please try again with new Author name",
      });
    } else {
      //hash the password
      const hashedPassword = await bcryptjs.hash(newAuthor.password, 7);
      //Replace plain password with hashed password
      newAuthor.password = hashedPassword;
      //Insert into database
      await authorsCollection.insertOne(newAuthor);
      //Send successful insertion response
      response.send({ message: "New Author has been registered!" });
    }
  })
);

//Author login
authorApp.post(
  "/login",
  expressAsyncHandler(async (request, response) => {
    //Get authorCred Obj
    const authorCred = request.body;
    //Check for user name
    const dbAuthor = await authorsCollection.findOne({
      userName: authorCred.userName,
    });
    if (!dbAuthor) {
      response.send({ message: "Invalid AuthorName" });
    } else {
      //Check for password
      const status = bcryptjs
        .compare(authorCred.password, dbAuthor.password)
        .then((status) => {
          if (status === false) {
            response.send({ message: "Invalid password" });
          } else {
            //Create jwt token and encode it
            const signedToken = jsonwebtoken.sign(
              { userName: dbAuthor.userName },
              process.env.SECRET_KEY1,
              { expiresIn: "1d" }
            );
            //Send response
            response.send({
              message: "Login successful!",
              payload: signedToken,
              user: dbAuthor,
            });
          }
        });
    }
  })
);

//Get articles of author
authorApp.get(
  "/viewArticles/:userName",
  verifyToken,
  expressAsyncHandler(async (request, response) => {
    //Get author's username from url
    const authorName = request.params.userName;
    //console.log(authorName)
    //Get articles which has status has true
    const articlesList = await articlesCollection
      .find({ userName: authorName })
      .toArray();
    //Send response
    //console.log(articlesList)
    response.send({
      message: "These are all the articles",
      payload: articlesList,
    });
  })
);

//Post article
authorApp.post(
  "/writeArticle",
  verifyToken,
  expressAsyncHandler(async (request, response) => {
    //Get new article from client
    const newArticle = request.body;
    console.log(newArticle);
    //Post into data base
    await articlesCollection.insertOne(newArticle);
    //Send response
    response.send({ message: "new article is created" });
  })
);

//Modify article
authorApp.put(
  "/modifyArticle",
  verifyToken,
  expressAsyncHandler(async (request, response) => {
    //Get modified article from client
    const modifiedArticle = request.body;
    //Update article by id
    const dbres = await articlesCollection.updateOne(
      { articleId: modifiedArticle.articleId },
      { $set: { ...modifiedArticle } }
    );

    let latestArticle = await articlesCollection.findOne({
      articleId: modifiedArticle.articleId,
    });

    //response
    if (dbres.modifiedCount === 1) {
      response.send({
        message: "article has been modified",
        article: latestArticle,
      });
    } else {
      response.send({ message: "modification failed" });
    }
  })
);

//Delete an article by article ID
authorApp.put(
  "/deleteArticle/:articleId",
  verifyToken,
  expressAsyncHandler(async (request, response) => {
    //Get articleId from url
    const articleIdFromUrl = +request.params.articleId;
    //Get article
    const articleToDelete = request.body;

    if (articleToDelete.status === true) {
      let modifiedArt = await articlesCollection.findOneAndUpdate(
        { articleId: articleIdFromUrl },
        { $set: { ...articleToDelete, status: false } },
        { returnDocument: "after" }
      );
      res.send({ message: "article deleted", payload: modifiedArt.status });
    }

    //modification
    if (articleToDelete.status === false) {
      let modifiedArt = await articlesCollection.findOneAndUpdate(
        { articleId: articleIdFromUrl },
        { $set: { ...articleToDelete, status: true } },
        { returnDocument: "after" }
      );
      res.send({ message: "article restored", payload: modifiedArt.status });
    }
  })
);

//Exporting authorApp
module.exports = authorApp;
