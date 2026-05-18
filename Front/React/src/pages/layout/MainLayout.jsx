import React, { useContext } from "react";
import Context from "../../context/context";
import { Outlet } from "react-router-dom";
import { TopNavigation } from "../../components/TopNavigation";

const MainLayout = () => {
  const { userInfo } = useContext(Context);
  return (
    <div className="mainContainer">
      <TopNavigation
        menuList={
          userInfo ? ["dataInput", "prediction", "logout"] : ["login", "join"]
        }
      />
      <Outlet />
    </div>
  );
};

export default MainLayout;
