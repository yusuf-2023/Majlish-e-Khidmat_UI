import React from "react";
import "../../styles/Loader.css";

 const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="spinner-container">
      <div className="simple-loader"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;
