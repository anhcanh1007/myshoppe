import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { schema, type Schema } from "../../ultils/rules";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import Input from "../../components/Input";
import { isAxiosUnprocessableEntityError } from "../../ultils/utils";
import type { ResponseApi } from "../../types/utils.type";
import { login } from "../../apis/auth.api";
import { useMutation } from "@tanstack/react-query";

type FormData = Omit<Schema, "confirm_password">;
const loginSchema = schema.omit(["confirm_password"]);
export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => login(body),
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => console.log(data),
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<FormData>>(error)) {
          const formError = error.response?.data.data;
          console.log(formError);
          if (formError) {
            console.log(formError);
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: "server",
              });
            });
          }
        }
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
              noValidate
              onSubmit={onSubmit}
            >
              <div className="text-2xl">Đăng nhập</div>
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
              <div className="mt-3">
                <button className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600">
                  Đăng nhập
                </button>
              </div>
              <div className="flex items-center justify-center mt-8">
                <span className="text-gray-400">Bạn chưa có tài khoản?</span>
                <Link className="text-red-400 ml-1" to="/register">
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
