import range from "lodash/range";
import { useEffect, useState } from "react";

interface Props {
  onChange?: (value: Date) => void;
  value?: Date;
  errorMessage?: string;
}

export default function DataSelect({ errorMessage, onChange, value }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990,
  });

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear(),
      });
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = e.target;
    const newDate = {
      date: value?.getDate() || 1,
      month: value?.getMonth() || 0,
      year: value?.getFullYear() || 1990,
      [name]: Number(valueFromSelect),
    };
    setDate(newDate);
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
  };

  return (
    <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
      <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">
        Ngày sinh
      </div>
      <div className="sm:w-[80%] sm:pl-5">
        <div className="flex justify-between">
          <select
            name="date"
            value={value?.getDate() || date.date}
            onChange={handleChange}
            className="h-10 w-[32%] rounded-sm border border-black/10 px-3"
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name="month"
            value={value?.getMonth() || date.month}
            onChange={handleChange}
            className="h-10 w-[32%] rounded-sm border border-black/10 px-3"
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            name="year"
            value={value?.getFullYear() || date.year}
            onChange={handleChange}
            className="h-10 w-[32%] rounded-sm border border-black/10 px-3"
          >
            <option disabled>Năm</option>
            {range(1990, 2026).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-1 min-h-[1.25rem] text-sm text-red-600">
          {errorMessage}
        </div>
      </div>
    </div>
  );
}
