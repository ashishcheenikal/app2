import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {useForm} from 'react-hook-form'  
import {yupResolver} from "@hookform/resolvers/yup"
import { registerSchema } from "./formSchema";

const userInitial = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export default function Register() {
  const [user, setUser] = useState(userInitial);
  const navigate = useNavigate();
  const registerFetch = async () => {
    const {data} = await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, {user}, {
        headers: {
          "Content-Type": "application/json",
        },
      })
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
    resolver: yupResolver(registerSchema),
  });

  const submitHandler = async (data) => {
    // e.preventDefault();
    console.log(data);
    let check = await registerFetch();
    console.log(check,"check");
    if (check.success) {
      sessionStorage.setItem("userData", JSON.stringify(check.data.token));
      alert("Registration success!");
      navigate("/login");
    } else {
      alert(check.message);
    }
  };
  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                </div>
                <form className="user" onSubmit={handleSubmit(submitHandler)}>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="exampleFirstName"
                        name="firstName"
                        {...register("firstName")}
                        placeholder="First Name"
                        onChange={handleChange}
                      />{errors.firstName ? (
                        <span className="text-red-900" style={{color:"red"}}>{errors.firstName.message}</span>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="exampleLastName"
                        name="lastName"
                        {...register("lastName")}

                        placeholder="Last Name"
                        onChange={handleChange}
                      />
                      {errors.lastName ? (
                        <span className="text-red-900" style={{color:"red"}}>{errors.lastName.message}</span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      id="exampleInputEmail"
                      name="email"
                      {...register("email")}

                      placeholder="Email Address"
                      onChange={handleChange}
                    />{errors.email ? (
                      <span className="text-red-900" style={{color:"red"}}>{errors.email.message}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        name="password"
                        {...register("password")}

                        placeholder="Password"
                        autoComplete="off"
                        onChange={handleChange}
                      />{errors.password ? (
                        <span className="text-red-900" style={{color:"red"}}>{errors.password.message}</span>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleRepeatPassword"
                        name="confirmPassword"
                        {...register("confirmPassword")}

                        placeholder="Repeat Password"
                        autoComplete="off"
                        onChange={handleChange}
                      />{errors.confirmPassword ? (
                        <span className="text-red-900" style={{color:"red"}}>{errors.confirmPassword.message}</span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-user btn-block"
                    type="submit"
                  >
                    Register Account
                  </button>
                </form>
                <hr />
                <div className="text-center">
                  <Link className="small" to="/forgetPassword">
                    Forgot Password?
                  </Link>
                </div>
                <div className="text-center">
                  <Link className="small" to="/login" >Already have an account? Login!</Link>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
