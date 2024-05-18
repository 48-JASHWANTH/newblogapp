import "./AuthorProfile.css";
import { NavLink, Outlet } from "react-router-dom";
import {useSelector} from 'react-redux';


function AuthorProfile() {
  let {currentUser}=useSelector(state=>state.userAuthorLoginReducer)
 
  return (
    <div className="authorProfile p-3 ">
      <ul className="nav justify-content-around fs-3">
        <li className="nav-item">
          <NavLink
            className="nav-link text-light"
            to={`articlesByAuthor/${currentUser.userName}`}
          >
            Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link text-light"
            to="newArticle"
          >
            Add new
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default AuthorProfile;