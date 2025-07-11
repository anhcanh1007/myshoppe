import { forwardRef, useState, type InputHTMLAttributes } from "react";

export interface PropsInputNumber
  extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
}
const InputNumber = forwardRef<HTMLInputElement, PropsInputNumber>(
  function InputNumberInner(
    {
      errorMessage,
      className,
      classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
      classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
      onChange,
      value = "",
      ...rest
    },
    ref
  ) {
    const [localValue, setLocalValue] = useState<string>(value as string);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (/^\d+$/.test(value) || value === "") {
        onChange && onChange(event);
        setLocalValue(value);
      }
    };
    return (
      <div className={className}>
        <input
          className={classNameInput}
          onChange={handleChange}
          {...rest}
          ref={ref}
          value={value || localValue}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    );
  }
);

export default InputNumber;
