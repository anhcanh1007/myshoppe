import type React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

interface PropsType {
  children: React.ReactNode;
}

export default function MainLayout({ children }: PropsType) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
