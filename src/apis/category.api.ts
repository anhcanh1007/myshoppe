import type Category from "../types/category.type";
import type { SuccessResponseApi } from "../types/utils.type";
import http from "../ultils/http";

const URl = "categories";
const categoryApi = {
  getCategories() {
    return http.get<SuccessResponseApi<Category[]>>(URl);
  },
};

export default categoryApi;
