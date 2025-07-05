import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { path } from "../../../constants/path";
import Button from "../../../components/Button";
import type Category from "../../../types/category.type";
import classNames from "classnames";
import type { NoUndefinedField } from "../../../types/utils.type";
import { schema, type Schema } from "../../../ultils/rules";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import InputNumber from "../../../components/InputNumber";
import RatingFilter from "../RatingFilter";
import { omit } from "lodash";
import type { QueryConfig } from "../../../hooks/useQueryConfig";

interface Props {
  categories: Category[];
  queryConfig: QueryConfig;
}

type FormData = NoUndefinedField<Pick<Schema, "price_max" | "price_min">>;
const priceSchema = schema.pick(["price_max", "price_min"]);

export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig;
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      price_max: "",
      price_min: "",
    },
    resolver: yupResolver(priceSchema),
  });
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min,
      }).toString(),
    });
  });

  const handleDeleteAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(queryConfig, [
          "rating_filter",
          "price_min",
          "price_max",
          "category",
        ])
      ).toString(),
    });
  };
  console.log(category);
  return (
    <div className="py-4">
      <Link
        to={path.home}
        className={classNames("flex items-center font-bold", {
          "text-orange-500": !category,
        })}
      >
        <svg viewBox="0 0 12 10" className="w-3 h-4 mr-3 fill-current">
          <g fillRule="evenodd" stroke="none" strokeWidth={1}>
            <g transform="translate(-373 -208)">
              <g transform="translate(155 191)">
                <g transform="translate(218 17)">
                  <path d="m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className="bg-gray-300 h-[1px] my-4" />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id;
          return (
            <li className="py-2 pl-2" key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id,
                  }).toString(),
                }}
                className={classNames("relative px-2", {
                  "font-semibold text-orange-500": isActive,
                })}
              >
                {isActive && (
                  <svg
                    viewBox="0 0 4 7"
                    className="absolute top-1 left-[-10px] h-2 w-2 fill-orange-500"
                  >
                    <polygon points="4 3.5 0 0 0 7" />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        to={path.home}
        className="flex items-center font-bold mt-4 uppercase"
      >
        <svg
          enableBackground="new 0 0 15 15"
          viewBox="0 0 15 15"
          x={0}
          y={0}
          className="w-3 h-4 fill-current stroke-current mr-3"
        >
          <g>
            <polyline
              fill="none"
              points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className="bg-gray-300 h-[1px] my-4" />
      <div className="my-5">
        <div>Khoản giá</div>
        <form className="mt-2" onSubmit={onSubmit}>
          <div className="flex items-start">
            <Controller
              control={control}
              name="price_min"
              render={({ field }) => {
                return (
                  <InputNumber
                    type="text"
                    className="grow"
                    placeholder="TỪ"
                    classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                    classNameError="hidden"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger("price_max");
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="price_max"
              render={({ field }) => {
                return (
                  <InputNumber
                    type="text"
                    className="grow"
                    placeholder="₫ ĐẾN"
                    classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                    classNameError="hidden"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger("price_min");
                    }}
                  />
                );
              }}
            />
          </div>
          <div className="mt-1 min-h-[1.25rem] text-center text-sm text-red-600">
            {errors.price_min?.message}
          </div>
          <Button className="w-full p-2 uppercase bg-orange-600 text-white text-sm hover:bg-orange-600/80 flex justify-center items-center">
            Áp dụng
          </Button>
        </form>
      </div>
      <div className="bg-gray-300 h-[1px] my-4" />
      <div className="text-sm">Đánh giá</div>
      <RatingFilter queryConfig={queryConfig} />
      <div className="bg-gray-300 h-[1px] my-4" />
      <Button
        className="w-full p-2 uppercase bg-orange-600 text-white text-sm hover:bg-orange-600/80 flex justify-center items-center"
        onClick={handleDeleteAll}
      >
        Xóa tất cả
      </Button>
    </div>
  );
}
