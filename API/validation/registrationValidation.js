const yup = require("yup");

const userSchema = yup.object({
  firstName: yup.string().required().min(5).max(20),
  lastName: yup.string().required().min(5).max(20),
  email: yup.string().required().email("Enter valid email address"),
  password: yup.string().required().min(5).max(10),
  confirmPassword: yup.string().required().oneOf([yup.ref('password'),null],"Password must be same"),
});

module.exports = userSchema;
