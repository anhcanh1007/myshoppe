import type { RegisterOptions, UseFormRegister } from "react-hook-form";
import type { InputHTMLAttributes } from "react";

interface PropsInput<TFormValues extends Record<string, any> = any>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  errorMessage?: string;
  register?: UseFormRegister<TFormValues>;
  rules?: RegisterOptions<TFormValues>;
  classNameInput?: string;
  classNameError?: string;
  name: Extract<keyof TFormValues, string>;
}
export default function Input({
  register,
  rules,
  className,
  name,
  errorMessage,
  classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
  classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
  ...rest
}: PropsInput) {
  const resultRegister = register && name ? register(name, rules) : null;
  return (
    <div className={className}>
      <input {...resultRegister} className={classNameInput} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
}
