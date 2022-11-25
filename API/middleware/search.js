const Users = require("../models/users");

exports.searchResults = (model) => {
  return async (req, res, next) => {
    const limit = parseInt(req.query.limit);
    const key = req.query.key;
    console.log(limit,key,'limitkey')
    let query = {admin:false};
    if (key && key.trim()) {
      query["$or"]=
       [
        { firstName : { $regex: key, $options: "i" } },
        { lastName : { $regex: key, $options: "i" } },
      ]
    }

    const results = {};
    try {
      results.results = await model
        .find(query,{firstName:1,lastName:1})
        .limit(limit)
        .exec();
      res.searchResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
