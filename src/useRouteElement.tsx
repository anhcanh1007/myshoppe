import { Navigate, Outlet, useRoutes } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterLayout from "./layouts/RegisterLayout";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";

const isAuthenticated = false;
function ProtectedRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
function RejectRoute() {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default function useRouteElement() {
  const useRouteElement = useRoutes([
    {
      path: "/",
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      ),
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "profile",
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          ),
        },
      ],
    },
    {
      path: "",
      element: <RejectRoute />,
      children: [
        {
          path: "/register",
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          ),
        },
        {
          path: "/login",
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          ),
        },
      ],
    },
  ]);
  return useRouteElement;
}
