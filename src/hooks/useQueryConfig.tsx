import omitBy from "lodash/omitBy";
import isUndefined from "lodash/isUndefined";
import type { ProductConfig } from "../types/product.type";
import { useQueryParams } from "./useQueryParams";

export type QueryConfig = {
  [key in keyof ProductConfig]: string;
};

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || "1",
      exclude: queryParams.exclude,
      limit: queryParams.limit || "10",
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      sort_by: queryParams.sort_by,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category,
    },
    isUndefined
  );
  return queryConfig;
}
