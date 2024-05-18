import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { resetState } from "../../redux/slices/userAuthorSlice";
import { useDispatch } from "react-redux";
import mainLogo from '../images/mainLogo.png'

function NavBar() {
  let { loginUserStatus, currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer
  );

  let dispatch = useDispatch();

  function signOut() {
    //remove token from local storage
    localStorage.removeItem("token");
    dispatch(resetState());
  }

  return (
    <nav>
      <img src={mainLogo} className="logo" />
      <ul>
        {loginUserStatus === false ? (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="SignUp">
                SignUp
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="SignIn">
                SignIn
              </NavLink>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="SignIn"
              onClick={signOut}
            >
              <p className="fs-3">Welcome {currentUser.userName}</p>
              SignOut
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
