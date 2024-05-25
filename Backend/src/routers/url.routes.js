const express = require("express");
const urlRouter = express.Router();
const {
  createLink,
  handleVisits,
  getLinks,
} = require("../controllers/url.controller");
const { accessTokenVerification } = require("../middleware/auth.middleware");

urlRouter.post("/create", accessTokenVerification, createLink);
urlRouter.get("/clicked/:code/:id", handleVisits);
urlRouter.get("/links", accessTokenVerification, getLinks);

module.exports = urlRouter;
