import React from "react";
import Header from "./Header";
import Footer from './Footer';
function HomePageAdmin(props) {
  return (
    <div>
      <Router>
        <Switch>

          <div className="sb-nav-fixed">
            <Header />
            <Route exact path="/admin/list-category">
              <ManageCategory />
            </Route>

            <Footer />
          </div>



        </Switch>
      </Router>
    </div>
  );
}

export default HomePageAdmin;
