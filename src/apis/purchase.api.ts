import type { Purchase, PurchaseListStatus } from "../types/purchase.type";
import type { SuccessResponseApi } from "../types/utils.type";
import http from "../ultils/http";

const URL = "purchases";

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body);
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, { params });
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    return http.post<SuccessResponseApi<Purchase[]>>(
      `${URL}/buy-products`,
      body
    );
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponseApi<{ deleted_count: number }>>(
      `${URL}`,
      {
        data: purchaseIds,
      }
    );
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponseApi<Purchase>>(
      `${URL}/update-purchase`,
      body
    );
  },
};
export default purchaseApi;
