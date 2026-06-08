import { Outlet } from "react-router";

const PublicLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;