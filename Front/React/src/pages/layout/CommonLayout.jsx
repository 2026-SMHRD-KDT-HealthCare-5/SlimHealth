import React from "react";
import { Outlet } from "react-router-dom";
import { TopNavigation } from "../../components/TopNavigation";

const CommonLayout = () => {
  return (
    <div className="mainContainer">
      <TopNavigation isBackButton menuList={[]} />
      <Outlet />
    </div>
  );
};

export default CommonLayout;
