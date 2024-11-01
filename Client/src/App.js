import React from "react";
import "./css/App.css";
import ScrollToTop from './ScrollToTop';
import Header from "./container/Header/Header";
import Footer from "./container/Footer/Footer";
import HomePage from "./container/Home/HomePage";
import ShopPage from "./container/Shop/ShopPage";
import DetailProductPage from "./container/DetailProduct/DetailProductPage";
import ShopCartPage from "./container/ShopCart/ShopCartPage";
import BlogPage from "./container/Blog/BlogPage";
import DetailBlog from "./container/Blog/DetailBlog";
import HomePageAdmin from "./container/System/HomePageAdmin";
import VerifyEmail from "./container/System/Email/VerifyEmail";
import LoginWebPage from "./container/Login/LoginWebPage";
import UserHomePage from "./container/User/UseHomePage";
import CustomScrollbars from "./component/input/CustomScrollbars";
import VoucherHomePage from "./container/Voucher/VoucherHomePage";
import OrderHomePage from "./container/Order/OrderHomePage";
import TopMenu from "./container/Header/TopMenu";
import PaymentSuccess from "./container/User/PaymentSuccess";
import MessagePage from "./container/Message/MessagePage";
import VnpayPaymentPage from "./container/Order/VnpayPaymentPage";
import VnpayPaymentSuccess from "./container/Order/VnpayPaymentSuccess";
import About from "./container/About/About";
import Notfound from "./container/Not-Found/Notfound";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const getUserData = () => JSON.parse(localStorage.getItem("userData"));

const Layout = ({ children, showTopMenu = false, showHeader = true, showFooter = true }) => {
  const user = getUserData();
  return (
    <div className="App">
      {showTopMenu && <TopMenu user={user} />}
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </div>
  );
};


function App() {
  return (
    <Router>
         <ScrollToTop />
      <Switch>
        <Route exact path="/">
          <Layout showFooter={true} showHeader={true}>
            <HomePage />
          </Layout>
        </Route>
        <Route path="/shop">
          <Layout showHeader={true}>
            <ShopPage />
          </Layout>
        </Route>
        <Route path="/detail-product/:id">
          <Layout showHeader={true}>
            <DetailProductPage />
          </Layout>
        </Route>
        <Route path="/admin/">
          {getUserData() && (getUserData().roleId === "R1" || getUserData().roleId === "R4") ? (
            <Layout showFooter={false} showHeader={false}>
              <HomePageAdmin />
            </Layout>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/user/">
          {getUserData() ? (
            <Layout showHeader={true}>
              <UserHomePage />
            </Layout>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/shopcart">
          <Layout showHeader={true}>
            <ShopCartPage />
          </Layout>
        </Route>
        <Route exact path="/payment/success">
          <Layout showHeader={true}>
            <PaymentSuccess />
          </Layout>
        </Route>
        <Route exact path="/payment/vnpay">
          <Layout showFooter={true} showHeader={true}>
            <VnpayPaymentPage />
          </Layout>
        </Route>
        <Route exact path="/payment/vnpay_return">
          <Layout showFooter={true} showHeader={true}>
            <VnpayPaymentSuccess />
          </Layout>
        </Route>
        <Route path="/login">
          <Layout showHeader={true}>
            <LoginWebPage />
          </Layout>
        </Route>
        <Route path="/voucher">
          <Layout showHeader={true}>
            <VoucherHomePage />
          </Layout>
        </Route>
        <Route path="/blog">
          <Layout showHeader={true}>
            <BlogPage />
          </Layout>
        </Route>
        <Route path="/blog-detail/:id">
          <Layout showHeader={true}>
            <DetailBlog />
          </Layout>
        </Route>
        <Route path="/about">
          <Layout showHeader={true}>
            <About />
          </Layout>
        </Route>
        <Route path="/verify-email">
          <Layout showHeader={true}>
            <VerifyEmail />
          </Layout>
        </Route>
        <Route path="/order/:userId">
          <Layout showFooter={true} showHeader={true}>
            <OrderHomePage />
          </Layout>
        </Route>
        <Route path="*">
          <Notfound />
        </Route>
      </Switch>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
