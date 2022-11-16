import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const userInitial = {
  email: "",
  password: "",
};

export default function Login() {
    const [user, setUser] = useState(userInitial);
  const navigate = useNavigate();
  const login = async () => {
    const {data} = await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, {user}, {
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
    let check = await login();
    console.log(check,"check");
    if (check.success) {
      sessionStorage.setItem("userData", JSON.stringify(check.data.token));
      navigate("/");
    } else {
      alert(check.message);
    }
  };
  return (
    <div> <div className="container">

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
                                <form className="user" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-user"
                                            id="exampleInputEmail" aria-describedby="emailHelp"
                                            placeholder="Enter Email Address..." name="email" onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-user"
                                            id="exampleInputPassword" placeholder="Password" name="password" onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <div className="custom-control custom-checkbox small">
                                            <input type="checkbox" className="custom-control-input" id="customCheck"/>
                                            <label className="custom-control-label" for="customCheck">Remember
                                                Me</label>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-user btn-block">
                                        Login
                                    </button>
                                    <hr/>
                                </form>
                                <div className="text-center">
                                    {/* <a className="small" href="forgot-password.html">Forgot Password?</a> */}
                                </div>
                                <div className="text-center">
                                    <Link className="small" to="/register" >Create an Account!</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

</div></div>
  )
}
