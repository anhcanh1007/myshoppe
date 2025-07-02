import { useQuery } from "@tanstack/react-query";
import AsideFilter from "./AsideFilter";
import Product from "./Product/Product";
import SortProductList from "./SortProduct";
import productApi from "../../apis/product.api";
import { useQueryParams } from "../../hooks/useQueryParams";
import Pagination from "../../components/Pagination";
import type { ProductConfig, ProductList } from "../../types/product.type";
import { isUndefined, omitBy } from "lodash";
import categoryApi from "../../apis/category.api";

export type QueryConfig = {
  [key in keyof ProductConfig]: string;
};

export default function ProductList() {
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
  const { data: productData } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductConfig);
    },
    gcTime: 5 * 60 * 1000,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(),
  });
  return (
    <div className="bg-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {productData && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <AsideFilter
                categories={categoriesData?.data.data || []}
                queryConfig={queryConfig}
              />
            </div>
            <div className="col-span-9">
              <SortProductList
                queryConfig={queryConfig}
                pageSize={productData.data.data.pagination.page_size}
              />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {productData.data.data.products.map((product) => (
                  <div className="col-span-1" key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={productData?.data.data.pagination.page_size}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
