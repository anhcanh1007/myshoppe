import type {
  Product,
  ProductConfig,
  ProductList,
} from "../types/product.type";
import type { SuccessResponseApi } from "../types/utils.type";
import http from "../ultils/http";

const URL = "/products";

const productApi = {
  getProducts(params: ProductConfig) {
    return http.get<SuccessResponseApi<ProductList>>(URL, {
      params,
    });
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponseApi<Product>>(`${URL}/${id}`);
  },
};

export default productApi;
