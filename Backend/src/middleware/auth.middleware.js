require("dotenv").config();
const jwt = require("jsonwebtoken");
const userServices = require("../services/user.services");
const { authConfig } = require("../config/auth.config");
const { User } = require("../models/user.model");
const { RESPONSE_STATUS_CONSTANTS } = require("../constants/server.constants");
const { Tokens } = require("../models/token.model");

async function accessTokenVerification(req, res, next) {
  try {
    // take the authorization header from the request headers
    const header = await req.headers["authorization"];
    // split the header token
    const bearerLessToken = header.split(" ")[1];
    // verify the token with secrets
    const verifiedTokenData = jwt.verify(
      bearerLessToken,
      authConfig.secrets.accessToken
    );
    if (!verifiedTokenData) {
      throw new Error("token doesn't verified");
    }
    // find the corresponding user data for access token
    const authenticatedUser = await User.findOne({
      where: {
        id: verifiedTokenData.userId,
      },
    });
    // if there is no such user
    if (!authenticatedUser) {
      throw new Error("Invalid User");
    }
    req.user = authenticatedUser;
    next();
  } catch (error) {
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

async function refreshTokenVerification(req, res) {
  try {
    // take the token from the req-header cookie
    const refreshToken = req.cookies.rtoken;
    //verify the token
    const decodedToken = jwt.verify(
      refreshToken,
      authConfig.secrets.refreshToken
    );
    const user = await Tokens.findOne({
      where: {
        user_id: decodedToken.userId,
      },
    });
    if (!user || user.length == 0) {
      throw new Error("Invalid user");
    }
    // generate new access token
    const newToken = await userServices.generateTokens(user.id);
    // return the new access token as response
    return res.send({
      accessToken: newToken.accessToken,
    });
  } catch (error) {
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.SERVER_ERROR);
  }
}

module.exports = { accessTokenVerification, refreshTokenVerification };
