const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(request, response, next) {
  //Get bearer token from headers of request
  const bearerToken = request.headers.authorization;
  //console.log(bearerToken)

  //If bearer token not available
  if (!bearerToken) {
    return response.send({
      message: "Unauthorised access. Plz login to continue",
    });
  }

  //Extract token from bearer token
  const token = bearerToken.split(" ")[1];
  //console.log(token)
  try {
    jwt.verify(token, process.env.SECRET_KEY1);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = verifyToken;
