const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { authConfig } = require("../config/auth.config");
const { User } = require("../models/user.model");
const { Tokens } = require("../models/token.model");
const { RESPONSE_STATUS_CONSTANTS } = require("../constants/server.constants");

async function createUser(userName, mailId, password) {
  try {
    // create a salt for hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    //get hashed password
    const hashedPassword = await bcrypt.hash(password, salt);
    // check Db for if user with same mail exist
    const users = await User.findOne({
      where: {
        mail: mailId,
      },
    });
    // if not existed
    if (!users || users.length === 0) {
      await User.create({
        name: userName,
        mail: mailId,
        password: hashedPassword,
      });
      return;
    }
    // if existed throw error to catch
  } catch (error) {
    throw error;
  }
}

async function loginUser(mailId, password) {
  try {
    // check the Db for the user
    const user = await User.findOne({
      where: {
        mail: mailId,
      },
    });
    // if user doesn't exist
    if (!user) {
      throw new Error("User doesn't exist");
    }
    // verify the user using bcrypt.compare
    const isVerified = await bcrypt.compare(password, user.password);
    // if user is not valid
    if (!isVerified) {
      throw new Error("Incorrect credentials!!!");
    }
    // if user is valid generate JWT tokens and return the tokens
    const tokens = await generateTokens(user.id);
    await saveToken(user.id, tokens.refreshToken);
    return tokens;
  } catch (error) {
    throw error;
  }
}

async function generateTokens(userId) {
  try {
    //generate tokens
    const accessToken = jwt.sign({ userId }, authConfig.secrets.accessToken, {
      expiresIn: authConfig.tokenExpiry.accessTokenExp,
    });
    const refreshToken = jwt.sign({ userId }, authConfig.secrets.refreshToken, {
      expiresIn: authConfig.tokenExpiry.refreshTokenExp,
    });
    // if no tokens genrated throw an error
    if (!accessToken || !refreshToken) {
      throw new Error("tokens not generated");
    }
    //response
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (err) {
    throw err;
  }
}

async function saveToken(userId, refreshToken) {
  try {
    // find user has existing token
    const user = await Tokens.findOne({ where: { user_id: userId } });
    // if no create new instance
    if (!user || user.length === 0) {
      await Tokens.create({
        user_id: userId,
        refresh_token: refreshToken,
      });
      return;
    } else {
      // otherwise update the token
      user.refresh_token = refreshToken;
      await user.save();
      return;
    }
  } catch (error) {
    throw err;
  }
}

async function logoutUser(userId) {
  try {
    // delete the refresh token
    const user = await Tokens.destroy({
      where: {
        user_id: userId,
      },
    });
    //  if user doesnt exist
    if (!user || user.length === 0) {
      throw new Error("Invalid user");
    }
    return user;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createUser,
  loginUser,
  generateTokens,
  saveToken,
  logoutUser,
};
