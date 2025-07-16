import { useMutation, useQuery } from "@tanstack/react-query";
import Input from "../../../../components/Input";
import { userSchema, type UserSchema } from "../../../../ultils/rules";
import userApi from "../../../../apis/user.api";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { useContext, useEffect } from "react";
import InputNumber from "../../../../components/InputNumber";
import DataSelect from "../../components/DateSelect";
import Button from "../../../../components/Button";
import { toast } from "react-toastify";
import { setProfileToLS } from "../../../../ultils/auth";
import { AppContext } from "../../../../contexts/app.context";

type FormData = Pick<
  UserSchema,
  "address" | "name" | "avatar" | "phone" | "date_of_birth"
>;

const profileSchema = userSchema.pick([
  "address",
  "phone",
  "avatar",
  "date_of_birth",
  "name",
]);

export default function Profile() {
  const { data: profileData, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getProfile,
  });
  const { setProfile } = useContext(AppContext);
  const profile = profileData?.data.data;
  const updateProfileMutation = useMutation({
    mutationFn: (body: FormData) => userApi.updateProfile(body),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      address: "",
      avatar: "",
      date_of_birth: new Date(1990, 0, 1),
      name: "",
      phone: "",
    },
    resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name);
      setValue("avatar", profile.avatar);
      setValue("phone", profile.phone);
      setValue("address", profile.address);
      setValue(
        "date_of_birth",
        profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : new Date(1990, 0, 1)
      );
    }
  }, [profile, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const res = updateProfileMutation.mutateAsync({ ...data });
    refetch();
    setProfile((await res).data.data);
    toast.success((await res).data.message);
    setProfileToLS((await res).data.data);
  });

  console.log(profileData);
  return (
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Hồ Sơ Của Tôi
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
          <div className="flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Email
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <div className="pt-3 text-gray-700">{profile?.email}</div>
            </div>
          </div>
          <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Tên
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                name="name"
                placeholder="Tên"
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Số điện thoại
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <InputNumber
                    classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    placeholder="Số điện thoại"
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
              Địa chỉ
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                register={register}
                name="address"
                placeholder="Địa chỉ"
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name="date_of_birth"
            render={({ field }) => (
              <DataSelect
                errorMessage={errors.date_of_birth?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
            <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button
                className="flex h-9 items-center bg-orange-600 px-5 text-center text-sm text-white hover:bg-orange-500/80"
                type="submit"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:w-72 md:border-l md:border-l-gray-200">
          <div className="flex flex-col items-center">
            <div className="my-5 h-24 w-24">
              <img
                src="https://cf.shopee.vn/file/d04ea22afab6e6d250a370d7ccc2e675_tn"
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <input className="hidden" type="file" accept=".jpg,.jpeg,.png" />
            <button
              type="button"
              className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
            >
              Chọn ảnh
            </button>
            <div className="mt-3 text-gray-400">
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
