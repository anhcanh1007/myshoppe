import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import productApi from "../../../apis/product.api";
import { useNavigate, useParams } from "react-router-dom";
import {
  formatCurrency,
  formatNumberToSocialStyle,
  getIdFromNameID,
  rateSale,
} from "../../../ultils/utils";
import Product from "../Product/Product";
import ProductRating from "../../../components/ProductRating";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Product as ProductType,
  ProductConfig,
} from "../../../types/product.type";
import QuantityNumber from "../../../components/QuantityNumber";
import purchaseApi from "../../../apis/purchase.api";
import { purchasesStatus } from "../../../constants/purchase";
import { toast } from "react-toastify";
import { path } from "../../../constants/path";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { convert } from "html-to-text";

export default function ProductDetail() {
  const { t } = useTranslation("product");
  const [buyCount, setBuyCount] = useState(1);
  const { nameId } = useParams();
  const id = getIdFromNameID(nameId as string);
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const purchaseInCartData = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) =>
      purchaseApi.addToCart(body),
  });

  const { data: productDetailData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductDetail(id as string),
  });
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState("");

  const product = productDetailData?.data.data;

  const currentImages = useMemo(() => {
    return product ? product.images.slice(...currentIndexImages) : [];
  }, [product, currentIndexImages]);

  const queryConfig: ProductConfig = {
    limit: "20",
    page: "1",
    category: product?.category._id,
  };

  const { data: productsData } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => productApi.getProducts(queryConfig),
    staleTime: 3 * 60 * 1000,
    enabled: Boolean(product),
  });

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const buyNow = async () => {
    const res = await purchaseInCartData.mutateAsync({
      buy_count: buyCount,
      product_id: product?._id as string,
    });
    const purchase = res.data.data;
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id,
      },
    });
  };

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]);
    }
  };
  const prev = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };

  const chooseactive = (img: string) => {
    setActiveImage(img);
  };

  const handleZoomIn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const image = imageRef.current as HTMLImageElement;
    const { naturalHeight, naturalWidth } = image;

    //cách 1: lấy offsetX, offsetY khi xử lý được bubble event
    // const { offsetX, offsetY } = e.nativeEvent;

    //cách 2: khi không xử lý được bubble event
    const offsetY = e.pageX - (rect.x + window.scrollX);
    const offsetX = e.pageY - (rect.y + window.scrollY);
    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);
    image.style.width = naturalWidth + "px";
    image.style.height = naturalHeight + "px";
    image.style.maxWidth = "unset";
    image.style.top = top + "px";
    image.style.left = left + "px";
  };

  const handleZoomOut = () => {
    imageRef.current?.removeAttribute("style");
  };

  const handleChangeCount = (value: number) => {
    setBuyCount(value);
  };

  const addToCart = () => {
    purchaseInCartData.mutate(
      {
        product_id: product?._id as string,
        buy_count: buyCount,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["purchases", { status: purchasesStatus.inCart }],
          });
          toast.success(data.data.message, { autoClose: 2000 });
        },
      }
    );
  };
  if (!product) return null;
  return (
    <div className="bg-gray-200 py-6">
      <Helmet>
        <title>{product.name} | My Shoppee</title>
        <meta
          name="description"
          content={convert(product.description, {
            limits: {
              maxInputLength: 150,
            },
          })}
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-4 shadow">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div
                className="relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in"
                onMouseMove={handleZoomIn}
                onMouseLeave={handleZoomOut}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className="absolute top-0 left-0 h-full w-full bg-white object-cover"
                  ref={imageRef}
                />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage;
                  return (
                    <div
                      className="relative w-full pt-[100%]"
                      key={img}
                      onMouseEnter={() => chooseactive(img)}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 border-2 border-orange-500" />
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">{product.name}</h1>
              <div className="mt-8 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-orange-500 text-orange-500">
                    {product.rating}
                  </span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname="fill-orange-500 h-4 w-4"
                    nonActiveClassname="fill-gray-300 text-gray-300 h-4 w-4"
                  />
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className="ml-1 text-gray-500">Đã bán</span>
                </div>
              </div>
              <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                <div className="text-gray-500 line-through">
                  ₫{formatCurrency(product.price_before_discount)}
                </div>
                <div className="ml-3 text-3xl font-medium text-orange-500">
                  ₫{formatCurrency(product.price)}
                </div>
                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <div className="capitalize text-gray-500">Số lượng</div>
                <QuantityNumber
                  value={buyCount}
                  max={product.quantity}
                  onIncrement={handleChangeCount}
                  onDecrement={handleChangeCount}
                  onType={handleChangeCount}
                  onFocusOut={handleChangeCount}
                />
                <div className="ml-6 text-sm text-gray-500">
                  {product.quantity} {t("product:available")}
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <button
                  onClick={addToCart}
                  className="flex h-12 items-center justify-center rounded-sm border border-orange-500 bg-orange-500/10 px-5 capitalize text-orange-500 shadow-sm hover:bg-orange-500/5"
                >
                  <svg
                    enableBackground="new 0 0 15 15"
                    viewBox="0 0 15 15"
                    x={0}
                    y={0}
                    className="mr-[10px] h-5 w-5 fill-current stroke-orange text-orange"
                  >
                    <g>
                      <g>
                        <polyline
                          fill="orange-900"
                          points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy="13.5" r={1} stroke="none" />
                        <circle cx="11.5" cy="13.5" r={1} stroke="none" />
                      </g>
                      <line
                        fill="none"
                        strokeLinecap="round"
                        strokeMiterlimit={10}
                        x1="7.5"
                        x2="10.5"
                        y1={7}
                        y2={7}
                      />
                      <line
                        fill="none"
                        strokeLinecap="round"
                        strokeMiterlimit={10}
                        x1={9}
                        x2={9}
                        y1="8.5"
                        y2="5.5"
                      />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className="flex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange-500 px-5 capitalize text-white shadow-sm outline-none hover:bg-orange-500/90"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mt-8 bg-white p-4 shadow">
          <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">
            Mô tả sản phẩm
          </div>
          <div className="mx-4 mt-12 mb-4 text-sm leading-loose">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="uppercase text-gray-400">CÓ THỂ BẠN CŨNG THÍCH</div>
          {productsData && (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {productsData.data.data.products.map((product) => (
                <div className="col-span-1" key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
