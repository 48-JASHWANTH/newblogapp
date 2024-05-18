import "./UserProfile.css";
import { NavLink, Outlet } from "react-router-dom";

function UserProfile() {
  return (
    <div>
      <NavLink to="articles" className="fs-4 text-light nav-link mt-4 text-center">
        Articles
      </NavLink>
      <Outlet />
    </div>
  );
}

export default UserProfile;
