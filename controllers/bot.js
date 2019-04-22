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
      for (let i = 0; i < 3; i++) {
        let temp = wiki().find(clientQuery, results => results[i]);
        searchResult.push(temp);
      }
      let answers = await Promise.all(searchResult);

      answers.forEach(page =>
        wikiResult.push({title: page.raw.title, link: page.raw.fullurl})
      );
      //console.log(wikiResult);
    }
  } catch (e) {
    next(e);
  }
  //console.log(result);
  res.json({...result, wikiInfo: wikiResult});
};

exports.eventQuery = async (req, res, next) => {
  const clientEvent = req.body.event;
  const parameter = req.body.parameter;
  const userID = req.body.userID;
  let result = null;
  let wikiResult = [];
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
    let randomResults = await wiki().random(3);
    let pageResults = [];
    randomResults.forEach(topic =>
      pageResults.push(wiki().find(topic, results => results[0]))
    );
    let finalResults = await Promise.all(pageResults);
    //console.log(finalResults);
    finalResults.forEach(result =>
      wikiResult.push({title: result.raw.title, link: result.raw.fullurl})
    );
    console.log(wikiResult);
    result = responses[0].queryResult;
  } catch (err) {
    next(err);
  }

  res.send({...result, wikiInfo: wikiResult});
};

exports.fulfillment = (req, res, next) => {
  res.send("fullfillment");
};
