import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
  const register = async () => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    let check = await register();
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
                <form className="user" onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="exampleFirstName"
                        name="firstName"
                        placeholder="First Name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="exampleLastName"
                        name="lastName"
                        placeholder="Last Name"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      id="exampleInputEmail"
                      name="email"
                      placeholder="Email Address"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleRepeatPassword"
                        name="confirmPassword"
                        placeholder="Repeat Password"
                        onChange={handleChange}
                      />
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
                  {/* <a className="small" href="forgot-password.html">
                    Forgot Password?
                  </a> */}
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
