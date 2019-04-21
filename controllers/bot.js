const config = require("../config/projectKey");
const structjson = require("../config/util");
const wiki = require("wikijs").default;

exports.textQuery = async (req, res, next) => {
  const clientQuery = req.body.text;
  const parameter = req.body.parameter; //will be an object
  const userID = req.body.userID;
  let result = null;
  let wikiResult = [];
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
    result = responses[0].queryResult;
    const searchResult = [];
    if (
      result.allRequiredParamsPresent &&
      result.action === "REQUEST_LEARNING"
    ) {
      //console.log(responses[0].queryResult.parameters.fields.subject);
      for (let i = 0; i < 3; i++) {
        let temp = wiki().find(clientQuery, results => results[i]);
        searchResult.push(temp);
      }
      let answers = await Promise.all(searchResult);
      //console.log(await answers[0].summary());
      answers.forEach(page =>
        wikiResult.push({title: page.raw.title, link: page.raw.fullurl})
      );
      console.log(wikiResult);
    }
  } catch (e) {
    next(e);
  }
  console.log(result);
  res.json({...result, wikiInfo: wikiResult});
};

exports.eventQuery = async (req, res, next) => {
  const clientEvent = req.body.event;
  const parameter = req.body.parameter;
  const userID = req.body.userID;
  const request = {
    session: req.app.locals.sessionPath + userID, //create unique dialogflow session
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        name: clientEvent,
        parameters: structjson.jsonToStructProto(parameter),
        // The language used by the client (en-US)
        languageCode: config.dialogFlowSessionLanguageCode
      }
    }
  };
  try {
    let responses = await req.app.locals.sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
  } catch (err) {
    next(err);
  }

  res.send("event route");
};

exports.fulfillment = (req, res, next) => {
  res.send("fullfillment");
};
