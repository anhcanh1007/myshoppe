// import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
// import type { FormData } from "../pages/Register/Register";
import * as yup from "yup";

// type Rules = {
//   [key in keyof FormData]?: RegisterOptions<FormData, key>;
// };

// export const getRules = (getValues: UseFormGetValues<any>): Rules => ({
//   email: {
//     required: {
//       value: true,
//       message: "Email bắt buộc nhập",
//     },
//     pattern: {
//       value: /^\S+@\S+\.\S+$/,
//       message: "Email không đúng định dạng",
//     },
//     maxLength: {
//       value: 160,
//       message: "Độ dài từ 5 - 160 ký tự",
//     },
//     minLength: {
//       value: 5,
//       message: "Độ dài từ 5 - 160 ký tự",
//     },
//   },
//   password: {
//     required: {
//       value: true,
//       message: "Password bắt buộc nhập",
//     },
//     maxLength: {
//       value: 160,
//       message: "Độ dài từ 6 - 160 ký tự",
//     },
//     minLength: {
//       value: 6,
//       message: "Độ dài từ 6 - 160 ký tự",
//     },
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: "Confirm password bắt buộc nhập",
//     },
//     maxLength: {
//       value: 160,
//       message: "Độ dài từ 6 - 160 ký tự",
//     },
//     minLength: {
//       value: 6,
//       message: "Độ dài từ 6 - 160 ký tự",
//     },
//     validate:
//       typeof getValues === "function"
//         ? (value) =>
//             value === getValues("password") || "Nhập lại password không đúng"
//         : undefined,
//   },
// });

function yupPassword(yupString: string) {
  return yup
    .string()
    .required("Comfirm password là bắt buộc")
    .min(6, "Độ dài 6 - 160 ký tự")
    .max(160, "Độ dài 6- 160 ký tự")
    .oneOf([yup.ref(yupString)], "Nhập lại password không khớp");
}

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent;

  if (price_min !== "" && price_max !== "") {
    return Number(price_max) >= Number(price_min);
  }
  return price_min !== "" || price_max !== "";
}
const passwordSchema = yup
  .string()
  .required("Password là bắt buộc")
  .min(6, "Độ dài 6 - 160 ký tự")
  .max(160, "Độ dài 6- 160 ký tự");

//sử dụng schema thay cho rules
export const schema = yup.object({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài 5 - 160 ký tự")
    .max(160, "Độ dài 5- 160 ký tự"),
  password: passwordSchema,
  confirm_password: yupPassword("password"),
  price_min: yup.string().test({
    name: "price-not-allow",
    message: "Giá không phù hợp",
    test: testPriceMinMax,
  }),
  price_max: yup.string().test({
    name: "price-not-allow",
    message: "Giá không phù hợp",
    test: testPriceMinMax,
  }),
  name: yup.string().trim().required("Nam bat buoc phai nhap"),
});

export const userSchema = yup.object({
  name: yup.string().max(160, "Độ dài không quá 160 ký tự").optional(),
  address: yup.string().max(160, "Độ dài không quá 160 ký tự").optional(),
  date_of_birth: yup
    .date()
    .max(new Date(), "Hãy chọn một ngày trong quá khứ")
    .optional(),
  avatar: yup.string().max(1000, "Độ dài không quá 1000 ký tự").optional(),
  phone: yup.string().max(20, "Độ dài không quá 20 ký tự").optional(),
  password: passwordSchema,
  new_password: passwordSchema,
  confirm_password: yupPassword("new_password"),
});
export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;
