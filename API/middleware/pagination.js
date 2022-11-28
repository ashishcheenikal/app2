const { models } = require("mongoose");
const Meeting = require("../models/Meeting");
const jwt = require("jsonwebtoken")

exports.paginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const token = JSON.parse(req.headers.authorization)
    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
    const id = decode.id
    let query = {}
    if(id){
      query = {
        $or: [
          { host: id},
          { participants: id },
        ]}
    }
    const results = {};
    try {
      results.totalCount = await model.countDocuments(query);
      results.results = await model
        .find(query)
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
