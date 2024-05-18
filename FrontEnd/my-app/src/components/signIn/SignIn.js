import React from "react";
import "./SignIn.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { userAuthorLoginThunk } from "../../redux/slices/userAuthorSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

function SignIn() {
  let {
    register,
    handleSubmit,
    //formState: { errors },
  } = useForm();

  //console.log(errors)

  let dispatch = useDispatch();

  let { loginUserStatus, currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer
  );

  let navigate = useNavigate();

  function onSignInFormSubmit(userCredentials) {
    console.log(userCredentials);
    dispatch(userAuthorLoginThunk(userCredentials));
  }

  //console.log(currentUser);

  useEffect(() => {
    if (loginUserStatus === true && currentUser.userType === "user") {
      navigate("/UserProfile");
    } else if (loginUserStatus === true && currentUser.userType === "author") {
      navigate("/AuthorProfile");
    }
  }, [loginUserStatus, currentUser]);

  return (
    <div className="body1">
      <div className="wrapper">
        <form onSubmit={handleSubmit(onSignInFormSubmit)}>
          <h1>SignIn</h1>
          {/* Radio */}
          <div className="mb-3">
            <label htmlFor="user" className="form-check-label me-3">
              SignIn as
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
              {...register("userName")}
              required
            />
            <FaUser className="i"/>
          </div>
          {/* Password */}
          <div className="input-box">
            <input
              placeholder="Password"
              type="password"
              id="password"
              {...register("password")}
              required
            />
            <FaLock className="i"/>
          </div>
          {/* Submit */}
          <button className="btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
 
export default SignIn;
