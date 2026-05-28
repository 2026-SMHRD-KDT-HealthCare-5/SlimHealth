import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { TopNavigation } from "../../components/TopNavigation";
import { LoadingBox } from "../../components/LoadingBox/LoadingBox";

const CommonLayout = () => {
  return (
    <Suspense fallback={<LoadingBox />}>
      <div className="mainContainer">
        <TopNavigation isBackButton menuList={[]} />
        <Outlet />
      </div>
    </Suspense>
  );
};

export default CommonLayout;
