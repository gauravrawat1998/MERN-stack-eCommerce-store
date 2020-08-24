import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "Something",
  description = "My Description",
  className = "bg-dark text-white text-center p-4",
  children,
}) => {
  return (
    <div>
      <Menu />
      <div className="container-fluid">
        <div className="bg-dark text-white text-center p-3">
          <h2 className="">{title}</h2>
          <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};

export default Base;
