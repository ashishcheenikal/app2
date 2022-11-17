import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useState } from "react";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState({ email: "" });
  const navigate = useNavigate()

  const resetSchema = yup.object().shape({
    email: yup.string().required().email("Enter valid email address"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetSchema),
  });
  const handleChange = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value });
  };
  const resetPassword = async () => {
    const user = email;
   const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/resetPassword`,{user});
   return res.data;

  };
  const submitHandler = async (data) => {
    const res =await resetPassword();
    if(res.success) {
        alert(res.message)
        navigate("/newPassword")
    }
    else {
        alert(res.message)
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-2">
                        Forgot Your Password?
                      </h1>
                      <p className="mb-4">
                        We get it, stuff happens. Just enter your email address
                        below and we'll send you a link to reset your password!
                      </p>
                    </div>
                    <form
                      className="user"
                      onSubmit={handleSubmit(submitHandler)}
                    >
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-user"
                          name="email"
                          {...register("email")}
                          onChange={handleChange}
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          placeholder="Enter Email Address..."
                        />
                        {errors.email ? (
                          <span
                            className="text-red-900"
                            style={{ color: "red" }}
                          >
                            {errors.email.message}
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-user btn-block"
                      >
                        Reset Password
                      </button>
                    </form>
                    <hr />
                    <div className="text-center">
                      <Link className="small" to="/register">
                        Create an Account!
                      </Link>
                    </div>
                    <div className="text-center">
                      <Link className="small" to="/login">
                        Already have an account? Login!
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
