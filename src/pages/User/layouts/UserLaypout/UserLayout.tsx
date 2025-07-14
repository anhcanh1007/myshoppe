import { Outlet } from "react-router-dom";
import UserSideNav from "../../components/UserSidenav";

export default function UserLayout() {
  return (
    <div>
      <UserSideNav />
      <Outlet />
    </div>
  );
}
