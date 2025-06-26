import type { RegisterOptions, UseFormRegister } from "react-hook-form";
import type { FormData } from "../../pages/Register/Register";
import type { InputHTMLAttributes } from "react";

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  register?: UseFormRegister<FormData>;
  rules?: RegisterOptions<FormData>;
  classNameInput?: string;
  classNameError?: string;
}
export default function Input({
  register,
  rules,
  className,
  type,
  name,
  errorMessage,
  classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
  classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
}: PropsInput) {
  const resultRegister = register && name ? register(name, rules) : {};
  return (
    <div className={className}>
      <input
        type={type}
        {...resultRegister}
        className={classNameInput}
        placeholder={classNameInput}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
}
