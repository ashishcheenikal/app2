const yup = require("yup");

const resetSchema = yup.object({
  email: yup.string().required().email("Enter valid email address"),
});

module.exports = resetSchema;
