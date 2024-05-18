import React from "react";
import "./SignUp.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

function SignUp() {
  let { register, handleSubmit } = useForm();

  let [err, setErr] = useState("");

  let navigate = useNavigate();

  async function onSignUpFormSubmit(userCredentials) {
    //console.log(userCredentials);
    if (userCredentials.userType === "user") {
      //Making http post req
      let res = await axios.post(
        "http://localhost:4000/userApi/newUser",
        userCredentials
      );
      //console.log(res);
      if (res.data.message === "New user has been registered!") {
        //navigate to login page
        navigate("/signIn");
      } else {
        setErr(res.data.message);
      }
    } else {
      let res = await axios.post(
        "http://localhost:4000/authorApi/newAuthor",
        userCredentials
      );
      if (res.data.message === "New Author has been registered!") {
        navigate("/signIn");
      } else {
        setErr(res.data.message);
      }
    }
  }

  //console.log(err);

  return (
    <div className="body1">
      <div className="wrapper">
        {/* Display user signIn error message */}
        {err.length !== 0 && <p className="text-danger fs-3">{err}</p>}
        <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
          <h1>SignUp</h1>
          {/* Radio */}
          <div className="mb-3">
            <label htmlFor="user" className="form-check-label me-3">
              SignUp as
            </label>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="author"
                value="author"
                {...register("userType")}
                required
              />
              <label htmlFor="author" className="form-check-label">
                Author
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="user"
                value="user"
                {...register("userType")}
              />
              <label htmlFor="author" className="form-check-label">
                User
              </label>
            </div>
          </div>
          {/* Username */}
          <div className="input-box">
            <input
              placeholder="Username"
              type="text"
              id="userName"
              className="form-control"
              {...register("userName")}
              required
            />
            <FaUser className="i" />
          </div>
          {/* Password */}
          <div className="input-box">
            <input
              placeholder="Password"
              type="password"
              id="password"
              className="form-control"
              {...register("password")}
              required
            />
            <FaLock className="i"/>
          </div>
          {/* Mail */}
          <div className="input-box">
            <input
              placeholder="Mail"
              type="mail"
              id="mail"
              className="form-control"
              {...register("mail")}
              required
            />
            <IoIosMail className="i"/>
          </div>
          {/* Submit */}
          <button className="btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
