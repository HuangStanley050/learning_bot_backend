const config = require("../config/projectKey");

exports.textQuery = async (req, res, next) => {
  const clientQuery = req.body.text;
  const parameter = req.body.parameter; //will be an object
  const userID = req.body.userID;
  //console.log(req.app.locals.sessionPath + userID);
  const request = {
    session: req.app.locals.sessionPath + userID, //create unique dialogue session
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: clientQuery,
        // The language used by the client (en-US)
        languageCode: config.dialogFlowSessionLanguageCode
      }
    },
    queryParams: {
      payload: {
        data: parameter
      }
    }
  };
  try {
    const responses = await req.app.locals.sessionClient.detectIntent(request);

    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
  } catch (e) {
    next(e);
  }
  res.send("text route");
};

exports.eventQuery = (req, res, next) => {
  res.send("event route");
};

exports.fulfillment = (req, res, next) => {
  res.send("fullfillment");
};
