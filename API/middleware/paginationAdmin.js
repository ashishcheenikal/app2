const { models } = require("mongoose");
const Meeting = require("../models/Meeting");

exports.paginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
   
    const results = {};
    try {
      results.totalCount = await model.countDocuments();
      results.results = await model
        .find({})
        .populate({ path: "host", select: ["firstName", "lastName"] })
        .populate({ path: "participants", select: ["firstName", "lastName"] })
        .skip(startIndex)
        .limit(limit)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
