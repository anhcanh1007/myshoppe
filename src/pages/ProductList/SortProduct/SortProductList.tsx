import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { sortBy, order as orderSort } from "../../../constants/product";
import type { ProductConfig } from "../../../types/product.type";
import type { QueryConfig } from "../ProductList";
import { path } from "../../../constants/path";
import { omit } from "lodash";
import classNames from "classnames";

interface Props {
  queryConfig: QueryConfig;
  pageSize: number;
}

export default function SortProductList({ pageSize, queryConfig }: Props) {
  const { sort_by = sortBy.createdAt, order } = queryConfig;
  const page = Number(queryConfig.page);
  const navigate = useNavigate();

  const isActiveSortBy = (
    sortByValue: Exclude<ProductConfig["sort_by"], undefined>
  ) => {
    return sort_by === sortByValue;
  };

  const handleSort = (
    sortByValue: Exclude<ProductConfig["sort_by"], undefined>
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue,
          },
          ["order"]
        )
      ).toString(),
    });
  };

  const handePriceOrder = (
    orderValue: Exclude<ProductConfig["order"], undefined>
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        order: orderValue,
        sort_by: sortBy.price,
      }).toString(),
    });
  };

  return (
    <div className="bg-gray-300/40 py-4 px-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <div>Sắp xếp theo</div>
          <button
            onClick={() => handleSort(sortBy.view)}
            className={classNames("h-8 px-4 text-center text-sm capitalize ", {
              "bg-orange-500 text-white hover:bg-orange-600/80": isActiveSortBy(
                sortBy.view
              ),
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(
                sortBy.view
              ),
            })}
          >
            Phổ biến
          </button>
          <button
            onClick={() => handleSort(sortBy.createdAt)}
            className={classNames("h-8 px-4 text-center text-sm capitalize ", {
              "bg-orange-500 text-white hover:bg-orange-600/80": isActiveSortBy(
                sortBy.createdAt
              ),
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(
                sortBy.createdAt
              ),
            })}
          >
            Mới nhất
          </button>
          <button
            onClick={() => handleSort(sortBy.sold)}
            className={classNames("h-8 px-4 text-center text-sm capitalize ", {
              "bg-orange-500 text-white hover:bg-orange-600/80": isActiveSortBy(
                sortBy.sold
              ),
              "bg-white text-black hover:bg-slate-100": !isActiveSortBy(
                sortBy.sold
              ),
            })}
          >
            Bán chạy
          </button>
          <select
            className="h-8 px-4 capitalize bg-white text-black text-sm hover:bg-slate-100 text-left outline-none"
            value={order || ""}
            onChange={(e) =>
              handePriceOrder(
                e.target.value as Exclude<ProductConfig["order"], undefined>
              )
            }
          >
            <option value="" disabled>
              Giá
            </option>
            <option value={orderSort.asc}>Giá: Thấp đến cao</option>
            <option value={orderSort.desc}>Giá: Cao đến thấp</option>
          </select>
        </div>

        <div className="flex items-center">
          <div>
            <span className="text-orange">{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className="ml-2 flex">
            {page === 1 ? (
              <span className="mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString(),
                  }).toString(),
                }}
                className="mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className="mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString(),
                  }).toString(),
                }}
                className="mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
