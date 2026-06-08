import { Navigate, Outlet } from "react-router";

const GuestOnlyRoute = () => {
  return <Outlet />;
};

export default GuestOnlyRoute;