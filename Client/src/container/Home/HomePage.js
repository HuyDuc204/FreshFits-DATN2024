import React, { useState, useEffect } from "react";
import NewProductFeature from "../../component/HomeFeature/NewProductFeature";
import { getProductNewService } from "../../services/userService";
import HomeBanner from "../../component/HomeFeature/HomeBanner";

function HomePage() {
  const [dataNewProductFeature, setNewProductFeature] = useState([]);
  const [dataBanner, setdataBanner] = useState([]);

  useEffect(() => {
    fetchProductNew();
    fetchDataBrand();
    window.scrollTo(0, 0);
  }, []);

  const fetchProductNew = async () => {
    let res = await getProductNewService(8);
    if (res && res.errCode === 0) {
      setNewProductFeature(res.data);
    }
  };
  let fetchDataBrand = async () => {
    let res = await getAllBanner({
      limit: 6,
      offset: 0,
      keyword: "",
    });
    if (res && res.errCode === 0) {
      setdataBanner(res.data);
    }
  };
  return (
    <div>
        <Slider {...settings}>
        {dataBanner &&
          dataBanner.length > 0 &&
          dataBanner.map((item, index) => {
            return (
              <HomeBanner image={item.image} name={item.name}></HomeBanner>
            );
          })}
      </Slider>
 
      <NewProductFeature data={dataNewProductFeature} />
    </div>
  );
}

export default HomePage;
