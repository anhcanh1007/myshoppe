import { useForm } from "react-hook-form";
import Input from "../../../../components/Input";
import { userSchema, type UserSchema } from "../../../../ultils/rules";
import userApi from "../../../../apis/user.api";
import { useMutation } from "@tanstack/react-query";
import type { ErrorResponseApi } from "../../../../types/utils.type";
import { isAxiosUnprocessableEntityError } from "../../../../ultils/utils";
import Button from "../../../../components/Button";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { omit } from "lodash";

const passwordSchema = userSchema.pick([
  "password",
  "new_password",
  "confirm_password",
]);

type PasswordFormData = Pick<
  UserSchema,
  "password" | "confirm_password" | "new_password"
>;

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm<PasswordFormData>({
    defaultValues: {
      password: "",
      new_password: "",
      confirm_password: "",
    },
    resolver: yupResolver(passwordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (body: PasswordFormData) => userApi.updateProfile(body),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = changePasswordMutation.mutateAsync(
        omit(data, ["confirm_password"])
      );
      toast.success((await res).data.message);
      reset();
    } catch (error) {
      if (
        isAxiosUnprocessableEntityError<ErrorResponseApi<PasswordFormData>>(
          error
        )
      ) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof PasswordFormData, {
              message: formError[key as keyof PasswordFormData],
              type: "Server",
            });
          });
        }
      }
    }
  });

  return (
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Thay đổi mật khẩu
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <form
        className="mt-8 flex flex-col-reverse md:flex-row md:items-start"
        onSubmit={onSubmit}
      >
        <div className="mt-6 flex-grow md:mt-0 md:pr-12">
          <div className="mt-2 mr-auto max-w-2xl flex-wrap flex sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Mật khẩu cũ
            </div>
            <div className="sm:w-[80%] sm:pl-5 relative">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                type="password"
                name="password"
                placeholder="Mật khẩu cũ"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className="mt-2 mr-auto max-w-2xl flex-wrap flex sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Mật khẩu mới
            </div>
            <div className="sm:w-[80%] sm:pl-5 relative">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                type="password"
                name="new_password"
                placeholder="Mật khẩu mới"
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className="mt-2 mr-auto max-w-2xl flex-wrap flex sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Nhập lại mật khẩu
            </div>
            <div className="sm:w-[80%] sm:pl-5 relative">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                type="password"
                name="confirm_password"
                placeholder="Nhập lại mật khẩu"
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button
                className="flex h-9 items-center bg-orange-600 px-5 text-center text-sm text-white hover:bg-orange-500/80"
                type="submit"
              >
                Change
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
