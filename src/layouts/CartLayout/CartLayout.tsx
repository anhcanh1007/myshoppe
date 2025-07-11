import React from "react";
import Footer from "../../components/Footer";
import CartHeader from "../../components/CartHeader";

interface PropsType {
  children: React.ReactNode;
}
export default function CartLayout({ children }: PropsType) {
  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  );
}
