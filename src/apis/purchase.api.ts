import type { Purchase, PurchaseListStatus } from "../types/purchase.type";
import type { SuccessResponseApi } from "../types/utils.type";
import http from "../ultils/http";

const URL = "purchases";

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: string }) {
    return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body);
  },
  getPurchases(params: PurchaseListStatus) {
    return http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, { params });
  },
};
export default purchaseApi;
