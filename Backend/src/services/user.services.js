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
    console.log(error);
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
    console.log(user);
    // if user doesn't exist
    if (!user) {
      throw new Error("User doesn't exist");
    }
    // verify the user using bcrypt.compare
    const isVerified = await bcrypt.compare(password, user.password);
    // if user is not valid
    console.log(isVerified);
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
    console.log(userId);
    const accessToken = jwt.sign({ userId }, authConfig.secrets.accessToken, {
      expiresIn: authConfig.tokenExpiry.accessTokenExp,
    });
    const refreshToken = jwt.sign({ userId }, authConfig.secrets.refreshToken, {
      expiresIn: authConfig.tokenExpiry.refreshTokenExp,
    });
    if (!accessToken || !refreshToken) {
      throw new Error("tokens not generated");
    }
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (err) {
    throw err;
  }
}

async function saveToken(userId, refreshToken) {
  try {
    console.log("user id", userId);
    const user = await Tokens.findOne({ where: { user_id: userId } });
    if (!user || user.length === 0) {
      await Tokens.create({
        user_id: userId,
        refresh_token: refreshToken,
      });
      return;
    } else {
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
    const user = await Tokens.destroy({
      where: {
        user_id: userId,
      },
    });
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
