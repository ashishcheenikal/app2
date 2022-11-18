import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewPassword.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";

const newPassSchema = yup.object().shape({
  password: yup.string().required().min(5).max(10),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Password must be same"),
});
const initialObj = {
  password: "",
  confirmPassword: "",
};
export default function NewPassword() {
  const { id, token } = useParams();
  const [pass, setPass] = useState(initialObj);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newPassSchema),
  });
  const handleChange = (e) => {
    setPass({ ...pass, [e.target.name]: e.target.value });
    console.log(pass,"pas");
  };
  const user = pass;  
  const newPassWord = async()=>{
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/newPassword/${id}/${token}`,{user}) 
    return res.data;
 }
  const submitHandler = async(data) => {
    const check = await newPassWord()
    if(check.success) {
        alert(check.message)
        navigate(`/login`)
    }
    else{
        alert(check.message)
        navigate(`/forgetPassword`)
    }
  };
  return (
    // <div className="formContainer">
    <div className="mainDiv">
      <div className="cardStyle">
        <div className="imgContainer">
          <img
              className="col-lg-6 d-none d-lg-block bg-login-image newPassImg"
              src="https://images.wallpaperscraft.com/image/single/pug_dog_hat_152625_3840x2160.jpg"
              alt=""
            />
        </div>
        <form
          action=""
          onSubmit={handleSubmit(submitHandler)}
          name="signupForm"
          id="signupForm"
        >
          <img
            src=""
            id="signupLogo"
            alt=""
          />

          <h2 className="formTitle">Reset Your Password</h2>

          <div className="inputDiv">
            <label className="inputLabel" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              name="password"
              onChange={handleChange}
            />
            {errors.password ? (
              <span className="text-red-900" style={{ color: "red" }}>
                {errors.password.message}
              </span>
            ) : (
              <></>
            )}
          </div>

          <div className="inputDiv">
            <label className="inputLabel" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              {...register("confirmPassword")}
              onChange={handleChange}

            />
            {errors.confirmPassword ? (
              <span className="text-red-900" style={{ color: "red" }}>
                {errors.confirmPassword.message}
              </span>
            ) : (
              <></>
            )}
          </div>

          <div className="buttonWrapper">
            <button
              type="submit"
              id="submitButton"
              className="submitButton pure-button pure-button-primary"
            >
              <span>Continue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    // </div>
  );
}
