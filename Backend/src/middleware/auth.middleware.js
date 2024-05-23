require("dotenv").config();
const jwt = require("jsonwebtoken");
const userServices = require("../services/user.services");
const { authConfig } = require("../config/auth.config");
const { User } = require("../models/user.model");
const { RESPONSE_STATUS_CONSTANTS } = require("../constants/server.constants");
const { Tokens } = require("../models/token.model");

async function accessTokenVerification(req, res, next) {
  try {
    console.log("call for access token.......");
    const header = await req.headers["authorization"];
    const bearerLessToken = header.split(" ")[1];
    const verifiedTokenData = jwt.verify(
      bearerLessToken,
      authConfig.secrets.accessToken
    );
    if (!verifiedTokenData) {
      throw new Error("token doesn't verified");
    }
    const authenticatedUser = await User.findOne({
      where: {
        id: verifiedTokenData.userId,
      },
    });
    if (!authenticatedUser) {
      throw new Error("Invalid User");
    }
    req.user = authenticatedUser;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

async function refreshTokenVerification(req, res) {
  try {
    console.log("call for refesh token");
    const refreshToken = req.cookies.rtoken;
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
    const newToken = await userServices.generateTokens(user.id);
    return res.send({
      accessToken: newToken.accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.SERVER_ERROR);
  }
}

module.exports = { accessTokenVerification, refreshTokenVerification };
