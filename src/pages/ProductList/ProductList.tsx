import { useQuery } from "@tanstack/react-query";
import AsideFilter from "./AsideFilter";
import Product from "./Product/Product";
import SortProductList from "./SortProduct";
import productApi from "../../apis/product.api";
import Pagination from "../../components/Pagination";
import type { ProductConfig, ProductList } from "../../types/product.type";
import categoryApi from "../../apis/category.api";
import useQueryConfig from "../../hooks/useQueryConfig";
import { Helmet } from "react-helmet-async";

export default function ProductList() {
  const queryConfig = useQueryConfig();

  const { data: productData } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductConfig);
    },
    staleTime: 3 * 60 * 1000,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(),
  });
  return (
    <div className="bg-gray-200 py-6">
      <Helmet>
        <title>Trang chủ</title>
        <meta name="description" content="Trang chủ dự án my" />
      </Helmet>
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
