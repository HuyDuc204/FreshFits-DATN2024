import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SideBar from "./SideBar";
import ManageOrder from "./Order/ManageOrder";
import DetailOrder from "./Order/DetailOrder";
import AddCategory from "./Category/AddCategory";
import ManageBrand from "./Brand/ManageBrand";
import AddBrand from "./Brand/AddBrand";
import AddReceipt from "./Receipt/AddReceipt";
import ManageSubject from "./Subject/ManageSubject";
import AddSubject from "./Subject/AddSubject";
import ManageReceipt from "./Receipt/ManageReceipt";
import DetailReceipt from "./Receipt/DetailReceipt";
import ManageTypeShip from "./TypeShip/ManageTypeShip";
import AddTypeShip from "./TypeShip/AddTypeShip";
import Turnover from "./Statistic/Turnover";
import Home from "./Home";
import ManageUser from "./User/ManageUser";
import Adduser from "./User/Adduser";

function HomePageAdmin(props) {
  return (
    <div>
      <Router>
        <Switch>
          <div className="sb-nav-fixed">
            <Header />
            <div id="layoutSidenav">
              <SideBar />
              <div id="layoutSidenav_content">
                <main>
                <Route exact path="/admin/">
                  <Home />
                </Route>
                <Route exact path="/admin/list-user">
                  <ManageUser />
                </Route>
                <Route exact path="/admin/add-user">
                  <Adduser />
                </Route>
                <Route exact path="/admin/edit-user/:id">
                  <Adduser />
                </Route>
                  <Route exact path="/admin/list-category">
                    <ManageCategory />
                  </Route>
                  <Route exact path="/admin/add-category">
                    <AddCategory />
                  </Route>
                  <Route exact path="/admin/edit-category/:id">
                    <AddCategory />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/list-brand">
                    <ManageBrand />
                  </Route>
                  <Route exact path="/admin/add-brand">
                    <AddBrand />
                  </Route>
                  <Route exact path="/admin/edit-brand/:id">
                    <AddBrand />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/list-product">
                    <ManageProduct />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/add-banner">
                    <AddBanner />
                  </Route>
                  <Route exact path="/admin/edit-banner/:id">
                    <AddBanner />
                  </Route>
                  <Route exact path="/admin/list-banner">
                    <ManageBanner />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/add-blog">
                    <AddBlog />
                  </Route>
                  <Route exact path="/admin/list-blog">
                    <ManageBlog />
                  </Route>
                  <Route exact path="/admin/edit-blog/:id">
                    <AddBlog />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/list-subject">
                    <ManageSubject />
                  </Route>
                  <Route exact path="/admin/add-subject">
                    <AddSubject />
                  </Route>
                  <Route exact path="/admin/edit-subject/:id">
                    <AddSubject />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/list-order">
                    <ManageOrder />
                  </Route>
                  <Route exact path="/admin/order-detail/:id">
                    <DetailOrder />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/add-receipt">
                    <AddReceipt />
                  </Route>
                  <Route exact path="/admin/list-receipt">
                    <ManageReceipt />
                  </Route>
                  <Route exact path="/admin/detail-receipt/:id">
                    <DetailReceipt />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/list-typeship">
                    <ManageTypeShip />
                  </Route>
                  <Route exact path="/admin/add-typeship">
                    <AddTypeShip />
                  </Route>
                  <Route exact path="/admin/edit-typeship/:id">
                    <AddTypeShip />
                  </Route>
                  {/* // */}
                  <Route exact path="/admin/turnover">
                    <Turnover />
                  </Route>
                  <Route exact path="/admin/profit">
                    <Profit />
                  </Route>
                  <Route exact path="/admin/stock-product">
                    <StockProduct />
                  </Route>
                  {/* // */}
                  {/* // */}
                  {/* // */}
                </main>

                <Footer />
              </div>
            </div>
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default HomePageAdmin;
