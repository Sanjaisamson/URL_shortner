const { where } = require("sequelize");
const { Link } = require("../models/urls.model");
const { Logs } = require("../models/visiting_logs.model");

async function createLink(url, url_code, userId) {
  try {
    // create a shortenedUrl link with domain name and urlcode
    const new_url = `http://localhost:3000/url/clicked/${url_code}`;
    // save the data on db
    const link = await Link.create({
      user_id: userId,
      url: url,
      url_code: url_code,
      short_url: new_url,
    });
    // add the link_id with the short url
    const short_url = `${new_url}/${link.id}`;
    return short_url;
  } catch (error) {
    throw error;
  }
}
async function handleVisits(link_code, link_id) {
  try {
    // check the db for the actual db corresponding to the link _id
    const link = await Link.findOne({
      where: {
        id: link_id,
        url_code: link_code,
      },
    });
    //actual link assigned to a variable
    const actualLink = link.url;

    // return
    return actualLink;
  } catch (error) {
    throw error;
  }
}
async function handleLog(
  link_id,
  deviceType,
  deviceVendor,
  deviceModel,
  clickedTime,
  clickedDate
) {
  try {
    // save the data on db
    await Logs.create({
      link_id: link_id,
      device_type: deviceType,
      device_vendor: deviceVendor,
      device_model: deviceModel,
      clicked_time: clickedTime,
      clicked_date: clickedDate,
    });
    return;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createLink,
  handleVisits,
  handleLog,
};
