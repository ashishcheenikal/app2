const yup = require("yup");

const userSchema = yup.object({
  email: yup.string().required().email("Enter valid email address"),
  password: yup.string().required().min(5).max(10),
});

module.exports = userSchema;
