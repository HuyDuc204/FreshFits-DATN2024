import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { NavLink } from "react-router-dom";

const Notfound = () => {
  return (
    <div>
      <Header />
      <div className="container  my-5">
        <h1 className="display-4">404 - Không tìm thấy trang</h1>
        <p className="lead">Trang bạn tìm kiếm không tồn tại.</p>
        <NavLink to="/" className=" mt-3">
          Trở về trang chính
        </NavLink>
      </div>
      <Footer />
    </div>
  );
};

export default Notfound;
