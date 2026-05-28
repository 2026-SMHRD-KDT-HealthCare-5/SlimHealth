import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TopNavigation } from "../../components/TopNavigation";
import { LoadingBox } from "../../components/LoadingBox/LoadingBox";

const CommonLayout = () => {
  const location = useLocation();

  return (
    <div className="mainContainer">
      <TopNavigation isBackButton menuList={[]} />

      <Suspense
        key={location.pathname + location.search}
        fallback={<LoadingBox />}
      >
        <Outlet />
      </Suspense>
    </div>
  );
};

export default CommonLayout;
