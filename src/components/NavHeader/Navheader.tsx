import { Link } from "react-router-dom";
import { path } from "../../constants/path";
import Popover from "../Popover";
import { purchasesStatus } from "../../constants/purchase";
import authApi from "../../apis/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import { getAvatarUrl } from "../../ultils/utils";
import { useTranslation } from "react-i18next";
import { locales } from "../../i18n/i18n";

export default function Navheader() {
  const { i18n } = useTranslation();
  const current = locales[i18n.language as keyof typeof locales];

  const handleChangelanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
  };
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } =
    useContext(AppContext);

  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
      queryClient.removeQueries({
        queryKey: ["purchases", { status: purchasesStatus.inCart }],
      });
    },
  });
  console.log(getAvatarUrl(profile?.avatar));

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex justify-end">
      <Popover
        className="flex cursor-pointer items-center py-1 hover:text-white/70"
        renderPopover={
          <div className="relative rounded-sm border border-gray-200 bg-white shadow-md">
            <div className="flex flex-col py-2 pr-28 pl-3">
              <button
                className="py-2 px-3 hover:text-orange-500"
                onClick={() => handleChangelanguage("vi")}
              >
                Tiếng Việt
              </button>
              <button
                onClick={() => handleChangelanguage("en")}
                className="mt-2 py-2 px-3 hover:text-orange-500"
              >
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        <span className="mx-1">{current}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className="ml-6 flex cursor-pointer items-center py-1 hover:text-white/70"
          renderPopover={
            <div className="relative rounded-sm border border-gray-200 bg-white shadow-md">
              <Link
                to={path.profile}
                className="block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500"
              >
                Tài khoản của tôi
              </Link>
              <Link
                to={path.historyPurchase}
                className="block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500"
              >
                Đơn mua
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500"
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <div className="mr-2 h-6 w-6 flex-shrink-0">
            <img
              src={profile?.avatar}
              alt="avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className="flex items-center">
          <Link
            to={path.register}
            className="mx-3 capitalize hover:text-white/70"
          >
            Đăng ký
          </Link>
          <div className="h-4 border-r-[1px] border-r-white/40" />
          <Link to={path.login} className="mx-3 capitalize hover:text-white/70">
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
