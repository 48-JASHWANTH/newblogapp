import React from "react";
import './RootLayout.css'
import NavBar from "../navBar/NavBar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="main-body">
      <NavBar />
      <div style={{minHeight:'82vh'}} className="outlet-div">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
