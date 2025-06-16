import type { RegisterOptions, UseFormRegister } from "react-hook-form";
import type { FormData } from "../../pages/Register/Register";

interface PropsInput {
  className: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  errorMessage?: string;
  register: UseFormRegister<FormData>;
  rules?: RegisterOptions<FormData>;
  name: keyof FormData;
}

export default function Input({
  className,
  placeholder,
  register,
  rules,
  type,
  errorMessage,
  name,
}: PropsInput) {
  return (
    <div className={className}>
      <input
        type={type}
        {...register(name, rules)}
        className="p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
        placeholder={placeholder}
      />
      <div className="mt-1 text-red-600 min-h-[1.25rem] text-sm">
        {errorMessage}
      </div>
    </div>
  );
}
