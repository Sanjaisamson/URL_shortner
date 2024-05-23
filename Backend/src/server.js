const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT;
const userRoutes = require("./routers/user.routes");
const urlRouter = require("./routers/url.routes");
const { dbConnect } = require("./utils/database.utils");

app.use(cookieParser());
app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ limit: "50mb", extended: true }));

async function bootstrap() {
  await dbConnect();
  app.use("/user", userRoutes);
  app.use("/url", urlRouter);
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap();

module.exports = { app };
