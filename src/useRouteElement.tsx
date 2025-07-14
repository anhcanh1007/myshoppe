import { Navigate, Outlet, useRoutes } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterLayout from "./layouts/RegisterLayout";
import MainLayout from "./layouts/MainLayout";

import { useContext } from "react";
import { AppContext } from "./contexts/app.context";
import { path } from "./constants/path";
import ProductDetail from "./pages/ProductList/ProductDetail";
import Cart from "./pages/Cart";
import CartLayout from "./layouts/CartLayout";
import Profile from "./pages/User/pages/Profile";
import UserLayout from "./pages/User/layouts/UserLaypout";
import ChangePassword from "./pages/User/pages/ChangePassword";
import HistoryPurchase from "./pages/User/pages/HistoryPurchase";

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
function RejectRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default function useRouteElement() {
  const useRouteElement = useRoutes([
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      ),
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      ),
    },

    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          ),
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.changePassword,
              element: <ChangePassword />,
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />,
            },
            {
              path: path.profile,
              element: <Profile />,
            },
          ],
        },
      ],
    },
    {
      path: "",
      element: <RejectRoute />,
      children: [
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          ),
        },
        {
          path: path.login,
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
