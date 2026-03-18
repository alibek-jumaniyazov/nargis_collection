import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Navbar />
      <main className="flex-1 pt-[68px] md:pt-[84px]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}