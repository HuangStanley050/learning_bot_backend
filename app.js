const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dialogflow = require("dialogflow");
const config = require("./config/projectKey");

const botRouter = require("./routes/bot");

const app = express();

//dialogflow set up
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(__dirname, "wiki-learning-98cf8922b0ac.json")
});
const sessionPath = sessionClient.sessionPath(
  config.googleProjectID,
  config.dialogFlowSessionID
);

//make the client and path available globally
app.locals.sessionClient = sessionClient;
app.locals.sessionPath = sessionPath;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/api/chatbot", botRouter);

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  //console.log(err.message);
  // render the error page
  console.log(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

module.exports = app;
