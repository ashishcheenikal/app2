const yup = require("yup");

const passSchema = yup.object({
    password: yup.string().required().min(5).max(10),
    confirmPassword: yup.string().required().oneOf([yup.ref('password'),null],"Password must be same"),
});

module.exports = passSchema;
