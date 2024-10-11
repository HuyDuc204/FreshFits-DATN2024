import React from "react";
import "./css/App.css";
import Header from "./container/Header/Header";
import Footer from "./container/Footer/Footer";
import HomePage from "./container/Home/HomePage";
import DetailProductPage from "./container/DetailProduct/DetailProductPage";
import HomePageAdmin from "./container/System/HomePageAdmin";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const getUserData = () => JSON.parse(localStorage.getItem("userData"));

const Layout = ({
  children,
  showTopMenu = false,
  showHeader = true,
  showFooter = true,
}) => {
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
    <>
      <Router>
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
            {getUserData() &&
            (getUserData().roleId === "R1" || getUserData().roleId === "R4") ? (
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

          <Route path="/login">
            <Layout showHeader={true}>
              <LoginWebPage />
            </Layout>
          </Route>
          <Route path="/voucher">
            <Layout showHeader={true}>voucher</Layout>
          </Route>
          <Route path="/blog">
            <Layout showHeader={true}>blog</Layout>
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
    </>
  );
}

export default App;
