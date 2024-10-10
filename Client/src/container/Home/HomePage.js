import React, { useState, useEffect } from "react";
import NewProductFeature from "../../component/HomeFeature/NewProductFeature";
import { getProductNewService } from "../../services/userService";
import HomeBanner from "../../component/HomeFeature/HomeBanner";

function HomePage() {
  const [dataNewProductFeature, setNewProductFeature] = useState([]);

  useEffect(() => {
    fetchProductNew();
    window.scrollTo(0, 0);
  }, []);

  const fetchProductNew = async () => {
    let res = await getProductNewService(8);
    if (res && res.errCode === 0) {
      setNewProductFeature(res.data);
    }
  };

  return (
    <div>
 
      <NewProductFeature data={dataNewProductFeature} />
    </div>
  );
}

export default HomePage;
