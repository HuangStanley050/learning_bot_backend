exports.textQuery = (req, res, next) => {
  res.send("text route");
};

exports.eventQuery = (req, res, next) => {
  res.send("event route");
};

exports.fulfillment = (req, res, next) => {
  res.send("fullfillment");
};
