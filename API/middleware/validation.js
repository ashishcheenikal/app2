const validation = (schema)=>async (req, res, next) => {
  const body = req.body.user;
  console.log(body);
  try {
    await schema.validate(body);
    // next();
    return next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = validation;