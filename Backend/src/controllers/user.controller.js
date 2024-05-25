const httpErrors = require("http-errors");
const userServices = require("../services/user.services");
const { authConfig } = require("../config/auth.config");
const { RESPONSE_STATUS_CONSTANTS } = require("../constants/server.constants");

async function createUser(req, res) {
  try {
    // call createUser service
    const { userName, mailId, password } = req.body;
    await userServices.createUser(userName, mailId, password);
    // response status code only
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.SUCCESS);
  } catch (error) {
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

async function loginUser(req, res) {
  try {
    // call loginUser service
    const { mailId, password } = req.body;
    const loginResponse = await userServices.loginUser(mailId, password);
    // set cookie as rtoken
    res.cookie("rtoken", loginResponse.refreshToken, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      maxAge: authConfig.cookieExpiry.maxAge,
    });
    // response
    return res
      .status(RESPONSE_STATUS_CONSTANTS.SUCCESS)
      .json({ accessToken: loginResponse.accessToken });
  } catch (error) {
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

async function logoutUser(req, res) {
  try {
    // call logoutUser service
    await userServices.logoutUser(req.user.id);
    // clear the cookie
    res.clearCookie("rtoken");
    // response
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.SUCCESS);
  } catch (error) {
    return res.sendStatus(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

module.exports = {
  loginUser,
  createUser,
  logoutUser,
};
