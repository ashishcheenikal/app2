import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { loginSchema } from "./formSchema";

const userInitial = {
  email: "",
  password: "",
};

export default function Login() {
  const [user, setUser] = useState(userInitial);
  const navigate = useNavigate();
  const login = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/login`,
      { user },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const SubmitHandler = async (data) => {
    // e.preventDefault();
    console.log(data);
    let check = await login();
    console.log(check, "check");
    if (check.success) {
      sessionStorage.setItem("userData", JSON.stringify(check.data.token));
      navigate("/");
    } else {
      alert(check.message);
    }
  };
  return (
    <div>
      {" "}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                      </div>
                      <form className="user" onSubmit={handleSubmit(SubmitHandler)}>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control form-control-user"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                            name="email"
                            {...register("email")}
                            onChange={handleChange}
                          />{errors.email ? (
                            <span className="text-red-900" style={{color:"red"}}>{errors.email.message}</span>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                            name="password"
                            {...register("password")}
                            autoComplete="off"
                            onChange={handleChange}
                          />{errors.password ? (
                            <span className="text-red-900" style={{color:"red"}}>{errors.password.message}</span>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="form-group">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck"
                            >
                              Remember Me
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-user btn-block"
                        >
                          Login
                        </button>
                        <hr />
                      </form>
                      <div className="text-center">
                        <Link className="small" to="/forgetPassword">Forgot Password?</Link>
                      </div>
                      <div className="text-center">
                        <Link className="small" to="/register">
                          Create an Account!
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
    </div>
  );
}
