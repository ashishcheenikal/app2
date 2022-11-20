import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().required().email("Enter valid email address"),
  password: yup.string().required().min(5).max(10),
});
