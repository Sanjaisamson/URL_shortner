const { ulid } = require("ulid");
const urlServices = require("../services/url.services");
const { RESPONSE_STATUS_CONSTANTS } = require("../constants/server.constants");
const UAParser = require("user-agent-parser");

async function createLink(req, res) {
  try {
    // url from the request body and check if exist
    const { url } = req.body;
    if (!url) {
      throw new Error("URL not found");
    }

    // check if url code exist
    let { customBackHalf: url_code } = req.body;
    if (!url_code) {
      url_code = ulid();
    }
    const userId = req.user.id;

    // call for create short_link
    const response = await urlServices.createLink(url, url_code, userId);

    // response
    return res.status(RESPONSE_STATUS_CONSTANTS.SUCCESS).json(response);
  } catch (error) {
    return res.status(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

async function handleVisits(req, res) {
  try {
    console.log("controller visited");
    const link_code = req.params.code;
    const link_id = parseInt(req.params.id);

    // get the request header (user-agent)
    const userAgentString = await req.headers["user-agent"];

    // parse the user Agent
    const parser = new UAParser(userAgentString);
    const deviceType = parser.getDevice().type || "Unknown";
    const deviceVendor = parser.getDevice().vendor || "Unknown";
    const deviceModel = parser.getDevice().model || "Unknown";

    // call for save the log details
    const logDetails = await urlServices.handleLog(
      link_id,
      deviceType,
      deviceVendor,
      deviceModel
    );

    // call for get the actual link
    const actualLink = await urlServices.handleVisits(link_code, link_id);

    // if no link response to the client with 404 not found
    if (!actualLink) {
      return res.status(404).json("url not Found");
    }
    //redirect to actual url
    return res.redirect(307, actualLink);
  } catch (error) {
    console.log(error);
    return res.status(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

async function getLinks(req, res) {
  try {
    const links = await urlServices.getLinks(req.user.id);
    return res.status(RESPONSE_STATUS_CONSTANTS.SUCCESS).json(links);
  } catch (error) {
    console.log(error);
    return res.status(RESPONSE_STATUS_CONSTANTS.FAILED);
  }
}

module.exports = {
  createLink,
  handleVisits,
  getLinks,
};
