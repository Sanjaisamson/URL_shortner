const express = require("express");
const urlRouter = express.Router();
const { createLink, handleVisits } = require("../controllers/url.controller");
const { accessTokenVerification } = require("../middleware/auth.middleware");

urlRouter.post("/create", accessTokenVerification, createLink);
urlRouter.get("/clicked/:code/:id", handleVisits);

module.exports = urlRouter;
