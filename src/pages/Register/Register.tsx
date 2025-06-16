import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import Input from "../../components/Input";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { schema, type Schema } from "../../ultils/ultils";

export type FormData = Schema;

export default function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(
    (data) => console.log(data),
    (data) => {
      const password = getValues("password");
      console.log(password);
    }
  );
  console.log(getValues("confirm_password"));
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
                <button
                  type="submit"
                  className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Đăng ký
                </button>
              </div>
              <div className="flex items-center justify-center mt-8">
                <span className="text-gray-400">Bạn đã có tài khoản?</span>
                <Link className="text-red-400 ml-1" to="/login">
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
