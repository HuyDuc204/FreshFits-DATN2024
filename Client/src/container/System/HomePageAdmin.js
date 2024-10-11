import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SideBar from "./SideBar";
import ManageOrder from "./Order/ManageOrder";
import DetailOrder from "./Order/DetailOrder";
import AddCategory from "./Category/AddCategory";
import ManageBrand from "./Brand/ManageBrand";
import AddBrand from "./Brand/AddBrand";
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
                  <Route exact path="/admin/list-order">
                    <ManageOrder />
                  </Route>
                  <Route exact path="/admin/order-detail/:id">
                    <DetailOrder />
                  </Route>
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
