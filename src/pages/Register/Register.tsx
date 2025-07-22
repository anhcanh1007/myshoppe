import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../components/Input";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { useMutation } from "@tanstack/react-query";
import authApi from "../../apis/auth.api";
import omit from "lodash/omit";
import { schema, type Schema } from "../../ultils/rules";
import { isAxiosUnprocessableEntityError } from "../../ultils/utils";
import type { ErrorResponseApi } from "../../types/utils.type";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import Button from "../../components/Button";
import { path } from "../../constants/path";
import { isAxiosError } from "axios";

export type FormData = Pick<Schema, "email" | "password" | "confirm_password">;
const registerSchema = schema.pick(["email", "password", "confirm_password"]);

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, "confirm_password">) =>
      authApi.registerAccount(body),
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["confirm_password"]);
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        setProfile(data.data.data.user);
        navigate("/");
      },
      onError: (error) => {
        if (
          isAxiosError(error) &&
          isAxiosUnprocessableEntityError<
            ErrorResponseApi<Omit<FormData, "confirm_password">>
          >(error)
        ) {
          const formError = error.response?.data.data;
          console.log(formError);
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, "confirm_password">, {
                message:
                  formError[key as keyof Omit<FormData, "confirm_password">],
                type: "server",
              });
            });
          }
        }
        //   if (formError?.email) {
        //     setError("email", {
        //       message: formError.email,
        //       type: "Server",
        //     });
        //   }
        //   if (formError?.password) {
        //     setError("password", {
        //       message: formError.password,
        //       type: "Server",
        //     });
        //   }
        // }
      },
    });
  });
  return (
    <div className="bg-orange-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form
              className="p-10 rounded bg-white shadow-sm"
              onSubmit={onSubmit}
              noValidate
            >
              <div className="text-2xl">Đăng ký</div>
              <Input
                className="mt-8"
                name="email"
                placeholder="Email"
                register={register}
                errorMessage={errors.email?.message}
                type="email"
              />
              <Input
                className="mt-2"
                type="password"
                name="password"
                placeholder="Password"
                register={register}
                errorMessage={errors.password?.message}
              />
              <Input
                className="mt-2"
                name="confirm_password"
                type="password"
                placeholder="Confirm password"
                register={register}
                errorMessage={errors.confirm_password?.message}
              />
              <div className="mt-3">
                <Button
                  disabled={registerAccountMutation.isPending}
                  isLoading={registerAccountMutation.isPending}
                  type="submit"
                  className="w-full flex justify-center items-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Đăng ký
                </Button>
              </div>
              <div className="flex items-center justify-center mt-8">
                <span className="text-gray-400">Bạn đã có tài khoản?</span>
                <Link className="text-red-400 ml-1" to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
