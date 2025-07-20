import { Navigate, Outlet, useRoutes } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
// import Login from "./pages/Login";
import RegisterLayout from "./layouts/RegisterLayout";
import MainLayout from "./layouts/MainLayout";

import { lazy, Suspense, useContext } from "react";
import { AppContext } from "./contexts/app.context";
import { path } from "./constants/path";
import ProductDetail from "./pages/ProductList/ProductDetail";
import Cart from "./pages/Cart";
import CartLayout from "./layouts/CartLayout";
import Profile from "./pages/User/pages/Profile";
import UserLayout from "./pages/User/layouts/UserLaypout";
import ChangePassword from "./pages/User/pages/ChangePassword";
import HistoryPurchase from "./pages/User/pages/HistoryPurchase";
import NotFound from "./pages/NotFound";

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
function RejectRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

//tác dụng của việc  sử dụng lazy để import component là để tránh việc một lần tải quá nhiều file js khi đã được build. Mà khi người dùng chuyển đến một trang nào đó thì mới bắt đầu tải file js thay vì trải 1 lần hết trước đó gây nặng website
const Login = lazy(() => import("./pages/Login"));

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
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          ),
        },
      ],
    },
    {
      path: "*",
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      ),
    },
  ]);
  return useRouteElement;
}
