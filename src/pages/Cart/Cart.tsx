import React, { useContext, useEffect, useMemo } from "react";
import Button from "../../components/Button";
import { formatCurrency, generateNameId } from "../../ultils/utils";
import QuantityNumber from "../../components/QuantityNumber";
import { Link, useLocation } from "react-router-dom";
import { path } from "../../constants/path";
import { useMutation, useQuery } from "@tanstack/react-query";
import { purchasesStatus } from "../../constants/purchase";
import purchaseApi from "../../apis/purchase.api";
import type { Purchase } from "../../types/purchase.type";
import { produce } from "immer";
import keyBy from "lodash/keyBy";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/app.context";

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked),
    [extendedPurchases]
  );
  const checkedPurchases = useMemo(
    () => extendedPurchases.filter((purchase) => purchase.checked),
    [extendedPurchases]
  );
  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count;
      }, 0),
    [checkedPurchases]
  );
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return (
          result +
          (current.product.price_before_discount - current.product.price) *
            current.buy_count
        );
      }, 0),
    [checkedPurchases]
  );

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ["purchases", { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
  });

  const purchasesInCart = purchasesInCartData?.data.data;
  const location = useLocation();
  const choosenPurchaseIdFromLocation = (
    location.state as { purchaseId: string } | null
  )?.purchaseId;

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, "_id");
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation =
            choosenPurchaseIdFromLocation === purchase._id;
          return {
            ...purchase,
            disabled: false,
            checked:
              isChoosenPurchaseFromLocation ||
              Boolean(extendedPurchasesObject[purchase._id]?.checked),
          };
        }) || []
      );
    });
  }, [purchasesInCart, choosenPurchaseIdFromLocation, setExtendedPurchases]);
  useEffect(() => {
    return () => {
      history.replaceState(null, "");
    };
  }, []);

  const buyPurchases = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message);
    },
  });

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count,
      }));

      buyPurchases.mutate(body);
    }
  };

  const deletePurchase = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDeletePurchase = (purchaseIndex: number) => {
    const purchaseId = extendedPurchases[purchaseIndex]._id;
    deletePurchase.mutate([purchaseId]);
  };

  const handleDeletePurchaseMany = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchase.mutate(purchaseIds);
  };

  const handleCheck =
    (productIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setExtendedPurchases(
        produce((draft) => {
          draft[productIndex].checked = e.target.checked;
        })
      );
    };

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked,
      }))
    );
  };

  const updatePurchase = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch();
    },
  });

  const handleQuantity = (
    purchaseIndex: number,
    value: number,
    enable: boolean
  ) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex];
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true;
        })
      );
      updatePurchase.mutate({
        product_id: purchase.product._id,
        buy_count: value,
      });
    }
  };

  const handeTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value;
      })
    );
  };

  return (
    <div className="bg-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow">
              <div className="col-span-6">
                <div className="flex items-center">
                  <div className="flex flex-shrink-0 items-center justify-center pr-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-orange-500"
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className="flex-grow text-black">Sản phẩm</div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="grid grid-cols-5 text-center">
                  <div className="col-span-2">Đơn giá</div>
                  <div className="col-span-1">Số lượng</div>
                  <div className="col-span-1">Số tiền</div>
                  <div className="col-span-1">Thao tác</div>
                </div>
              </div>
            </div>
            <div className="my-3 rounded-sm bg-white p-5 shadow">
              {extendedPurchases?.map((purchase, index) => (
                <div
                  key={purchase._id}
                  className="mb-5 grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0"
                >
                  <div className="col-span-6">
                    <div className="flex">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-orange-500"
                          checked={purchase.checked}
                          onChange={handleCheck(index)}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex">
                          <Link
                            className="h-20 w-20 flex-shrink-0"
                            to={`${path.home}${generateNameId({
                              name: purchase.product.name,
                              id: purchase.product._id,
                            })}`}
                          >
                            <img
                              alt={purchase.product.name}
                              src={purchase.product.image}
                            />
                          </Link>
                          <div className="flex-grow px-2 pt-1 pb-2">
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id,
                              })}`}
                              className="line-clamp-2 text-left"
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="grid grid-cols-5 items-center">
                      <div className="col-span-2">
                        <div className="flex items-center justify-center">
                          <span className="text-gray-300 line-through">
                            ₫
                            {formatCurrency(
                              purchase.product.price_before_discount
                            )}
                          </span>
                          <span className="ml-3">
                            ₫{formatCurrency(purchase.product.price)}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <QuantityNumber
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          classNameWrapper="flex items-center"
                          onIncrement={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value <= purchase.product.quantity
                            )
                          }
                          onDecrement={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value <= purchase.product.quantity
                            )
                          }
                          onType={handeTypeQuantity(index)}
                          onFocusOut={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value >= 1 &&
                                value <= purchase.product.quantity &&
                                value !==
                                  (purchasesInCart as Purchase[])[index]
                                    .buy_count
                            )
                          }
                          disabled={purchase.disabled}
                        />
                      </div>
                      <div className="col-span-1">
                        <span className="text-orange">
                          ₫
                          {formatCurrency(
                            purchase.product.price * purchase.buy_count
                          )}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => handleDeletePurchase(index)}
                          className="bg-none text-black transition-colors hover:text-orange-500"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center">
          <div className="flex items-center">
            <div className="flex flex-shrink-0 items-center justify-center pr-3">
              <input
                type="checkbox"
                className="h-5 w-5 accent-orange-500"
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
            </div>
            <button
              className="mx-3 border-none bg-none"
              onClick={handleCheckAll}
            >
              Chọn tất cả {extendedPurchases.length}
            </button>
            <button
              onClick={handleDeletePurchaseMany}
              className="mx-3 border-none bg-none"
            >
              Xóa
            </button>
          </div>

          <div className="mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center sm:justify-end">
                <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                <div className="ml-2 text-2xl text-orange">
                  ₫{formatCurrency(totalCheckedPurchasePrice)}
                </div>
              </div>
              <div className="flex items-center text-sm sm:justify-end">
                <div className="text-gray-500">Tiết kiệm</div>
                <div className="ml-6 text-orange-500">
                  ₫{formatCurrency(totalCheckedPurchaseSavingPrice)}
                </div>
              </div>
            </div>
            <Button
              onClick={handleBuyPurchases}
              className="mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0"
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
