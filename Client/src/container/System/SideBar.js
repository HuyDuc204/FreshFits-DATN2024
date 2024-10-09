import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Trang chủ",
    icon: "fas fa-tachometer-alt",
    path: "/admin",
  },
  {
    title: "Quản lý người dùng",
    icon: "fas fa-users",
    roleId: "R1",
    submenu: [
      { title: "Danh sách người dùng", path: "/admin/list-user" },
      { title: "Thêm người dùng", path: "/admin/add-user" },
    ],
  },
  {
    title: "Quản lý danh mục",
    icon: "fas fa-list-ol",
    roleId: "R1",
    submenu: [
      { title: "Danh sách danh mục", path: "/admin/list-category" },
      { title: "Thêm danh mục", path: "/admin/add-category" },
    ],
  },
  {
    title: "Quản lý nhãn hàng",
    icon: "far fa-copyright",
    roleId: "R1",
    submenu: [
      { title: "Danh sách nhãn hàng", path: "/admin/list-brand" },
      { title: "Thêm nhãn hàng", path: "/admin/add-brand" },
    ],
  },
  {
    title: "Quản lý sản phẩm",
    icon: "fas fa-tshirt",
    roleId: "R1",
    submenu: [
      { title: "Danh sách sản phẩm", path: "/admin/list-product" },
      { title: "Thêm sản phẩm", path: "/admin/add-product" },
    ],
  },
  {
    title: "Quản lý băng rôn",
    icon: "fab fa-adversal",
    roleId: "R1",
    submenu: [
      { title: "Danh sách băng rôn", path: "/admin/list-banner" },
      { title: "Thêm băng rôn", path: "/admin/add-banner" },
    ],
  },
  {
    title: "Quản lý chủ đề",
    icon: "fab fa-blogger",
    roleId: "R1",
    submenu: [
      { title: "Danh sách chủ đề", path: "/admin/list-subject" },
      { title: "Thêm chủ đề", path: "/admin/add-subject" },
    ],
  },
  {
    title: "Quản lý bài đăng",
    icon: "fas fa-feather-alt",
    roleId: "R1",
    submenu: [
      { title: "Danh sách bài đăng", path: "/admin/list-blog" },
      { title: "Thêm bài đăng", path: "/admin/add-blog" },
    ],
  },
  {
    title: "Quản lý loại ship",
    icon: "fas fa-shipping-fast",
    roleId: "R1",
    submenu: [
      { title: "Danh sách loại giao hàng", path: "/admin/list-typeship" },
      { title: "Thêm loại giao hàng", path: "/admin/add-typeship" },
    ],
  },
  {
    title: "Quản lý voucher",
    icon: "fas fa-percentage",
    roleId: "R1",
    submenu: [
      // { title: "Danh sách loại khuyến mãi", path: "/admin/list-typevoucher" },
      // { title: "Danh sách mã khuyến mãi", path: "/admin/list-voucher" },
      // { title: "Thêm loại khuyến mãi", path: "/admin/add-typevoucher" },
      { title: "Thêm mã khuyến mãi", path: "#" },
    ],
  },
  {
    title: "Quản lý NCC",
    icon: "fa-solid fa-person-military-pointing",
    submenu: [
      { title: "Danh sách NCC", path: "/admin/list-supplier" },
      { title: "Thêm nhà cung cấp", path: "/admin/add-supplier" },
    ],
  },
  {
    title: "Quản lý nhập hàng",
    icon: "fa-solid fa-file-import",
    submenu: [
      { title: "Danh sách nhập hàng", path: "/admin/list-receipt" },
      { title: "Thêm nhập hàng", path: "/admin/add-receipt" },
    ],
  },
  {
    title: "Quản lý đơn hàng",
    icon: "fas fa-cart-plus",
    submenu: [{ title: "Danh sách đơn hàng", path: "/admin/list-order" }],
  },
  {
    title: "Quản lý tin nhắn",
    icon: "fa-brands fa-facebook-messenger",
    submenu: [{ title: "Messenger", path: "/admin/chat" }],
  },
  {
    title: "Thống kê",
    icon: "fa-solid fa-magnifying-glass-chart",
    roleId: "R1",
    submenu: [
      { title: "Thống kê doanh thu", path: "/admin/turnover" },
      { title: "Thống kê lợi nhuận", path: "/admin/profit" },
      { title: "Thống kê tồn kho", path: "/admin/stock-product" },
    ],
  },
];  

const SideBar = () => {
  const [user, setUser] = useState({});
  const location = useLocation(); // Hook to get current route

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? { fontWeight: "bold", backgroundColor: "#e9ecef" }
      : {};

  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion"
        id="sidenavAccordion"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            {menuItems.map((item, index) => {
              if (item.roleId && item.roleId !== user.roleId) return null;
              const menuStyle = { color: "#000" }; // Black color for titles

              return item.submenu ? (
                <div key={index}>
                  <a
                    className="nav-link collapsed"
                    href="#"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                    style={menuStyle}
                  >
                    <div className="sb-nav-link-icon">
                      <i className={item.icon}></i>
                    </div>
                    {item.title}
                    <div className="sb-sidenav-collapse-arrow">
                      <i className="fas fa-angle-down"></i>
                    </div>
                  </a>
                  <div
                    className="collapse"
                    id={`collapse${index}`}
                    aria-labelledby="headingOne"
                    data-bs-parent="#sidenavAccordion"
                  >
                    <nav className="sb-sidenav-menu-nested nav">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="nav-link"
                          style={{
                            color: "green", // Red color for submenu items
                            ...isActive(subItem.path),
                          }}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className="nav-link"
                  style={{
                    color: "green", // Black color for titles
                    ...isActive(item.path),
                  }}
                >
                  <div className="sb-nav-link-icon">
                    <i className={item.icon}></i>
                  </div>
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="sb-sidenav-footer">Trang quản trị</div>
      </nav>
    </div>
  );
};

export default SideBar;
