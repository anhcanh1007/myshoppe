import type React from "react";
import InputNumber from "../InputNumber";
import type { PropsInputNumber } from "../InputNumber/InputNumber";

interface Props extends PropsInputNumber {
  max?: number;
  onIncrement?: (value: number) => void;
  onDecrement?: (value: number) => void;
  onType?: (value: number) => void;
  classNameWrapper: string;
}

export default function QuantityNumber({
  max,
  onDecrement,
  onIncrement,
  onType,
  classNameWrapper = "ml-10",
  value,
  ...rest
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value);
    if (max !== undefined && _value > max) {
      _value = max;
    } else if (_value < 1) {
      _value = 1;
    }
    onType && onType(_value);
  };

  const increase = () => {
    let _value = Number(value) + 1;
    if (max !== undefined && _value > max) {
      _value = max;
    }
    onIncrement && onIncrement(_value);
  };
  const decrease = () => {
    let _value = Number(value) - 1;
    if (max !== undefined && _value > max) {
      _value = max;
    }
    onDecrement && onDecrement(_value);
  };

  return (
    <div className={"flex items-center " + classNameWrapper}>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600"
        onClick={decrease}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <InputNumber
        value={value}
        className=""
        classNameError="hidden"
        classNameInput="h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none"
        onChange={handleChange}
        {...rest}
      />
      <button
        className="flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600"
        onClick={increase}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
}
