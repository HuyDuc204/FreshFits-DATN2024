import React, { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useDispatch } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { addItemCartStart } from "../../action/ShopCartAction";
import "./InfoDetailProduct.scss";
import CommonUtils from "../../utils/CommonUtils";
import { useHistory } from "react-router-dom"; // Thêm import này
import { toast } from "react-toastify";
function InfoDetailProduct(props) {
  const history = useHistory(); // Khởi tạo useHistory
  const dispatch = useDispatch();

  let { dataProduct } = props;
  let [arrDetail, setarrDetail] = useState([]);
  const [productDetail, setproductDetail] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [imgPreview, setimgPreview] = useState("");
  const [activeLinkId, setactiveLinkId] = useState("");
  const [quantity, setquantity] = useState("");
  const [quantityProduct, setquantityProduct] = useState(1);
  const [modalOpen, setModalOpen] = useState(false); // State cho modal

  useEffect(() => {
    let { productDetail } = dataProduct ? dataProduct : [];
    if (productDetail) {
      setproductDetail(productDetail);
      setarrDetail(productDetail[0]);
      setactiveLinkId(productDetail[0].productDetailSize[0].id);
      setquantity(productDetail[0].productDetailSize[0].stock);
      props.sendDataFromInforDetail(productDetail[0].productDetailSize[0]);
    }
  }, [props.dataProduct]);

  const handleSelectDetail = (event) => {
    setarrDetail(productDetail[event.target.value]);
    if (
      productDetail[event.target.value] &&
      productDetail[event.target.value].productDetailSize.length > 0
    ) {
      setactiveLinkId(
        productDetail[event.target.value].productDetailSize[0].id
      );
      setquantity(productDetail[event.target.value].productDetailSize[0].stock);
      props.sendDataFromInforDetail(
        productDetail[event.target.value].productDetailSize[0]
      );
    }
  };

  const openPreviewImage = (url) => {
    setimgPreview(url);
    setisOpen(true);
  };

  const handleClickBoxSize = (data) => {
    setactiveLinkId(data.id);
    setquantity(data.stock);
    props.sendDataFromInforDetail(data);
  };

  const handleAddShopCart = () => {
    if (quantityProduct < 0) {
      toast.error("Số lượng không được là số âm!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }



    if (props.userId) {
      dispatch(
        addItemCartStart({
          userId: props.userId,
          productdetailsizeId: activeLinkId,
          quantity: quantityProduct,
        })
      );
      setModalOpen(true); // Mở modal khi thêm vào giỏ hàng
    } else {
      alert("Đăng nhập để thêm vào giỏ hàng");
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="row s_product_inner">
      {/* Modal thông báo thêm vào giỏ hàng */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Thông báo</ModalHeader>
        <ModalBody>Sản phẩm đã được thêm vào giỏ hàng!</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => history.push("/shopcart")}>
            Đi đến giỏ hàng
          </Button>
          <Button color="secondary" onClick={closeModal}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>

      {/* Nội dung sản phẩm */}
      <div className="col-lg-6">
        <div className="s_product_img">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-ride="carousel"
          >
            <div>
              <ol className="carousel-indicators">
                {arrDetail &&
                  arrDetail.productImage &&
                  arrDetail.productImage.length > 0 &&
                  arrDetail.productImage.map((item, index) => {
                    return (
                      <li
                        data-target="#carouselExampleIndicators"
                        data-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        key={index}
                      >
                        <img
                          height="60px"
                          className="w-100"
                          src={item.image}
                          alt=""
                        />
                      </li>
                    );
                  })}
              </ol>
            </div>
            <div className="carousel-inner">
              {arrDetail &&
                arrDetail.productImage &&
                arrDetail.productImage.length > 0 &&
                arrDetail.productImage.map((item, index) => {
                  return (
                    <div
                      onClick={() => openPreviewImage(item.image)}
                      style={{ cursor: "pointer" }}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={index}
                    >
                      <img
                        className="d-block w-100"
                        src={item.image}
                        alt="Ảnh bị lỗi"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5 offset-lg-1">
        <div className="s_product_text">
          <h3>{dataProduct.name}</h3>
          <h2>{CommonUtils.formatter.format(arrDetail.discountPrice)}</h2>
          <ul className="list">
            <li>
              <a className="active" href="#">
                <span>Loại</span> :{" "}
                {dataProduct && dataProduct.categoryData
                  ? dataProduct.categoryData.value
                  : ""}
              </a>
            </li>
            <li>
              <a href="#">
                {" "}
                <span>Trạng thái</span> :{" "}
                <span
                  style={{
                    fontSize: "15px",
                    color: quantity > 0 ? "green" : "red",
                  }}
                >
                  {quantity > 0 ? "Còn hàng" : "Hết hàng !"}
                </span>
              </a>
            </li>
            <li>
              <div className="box-size">
                <a href="#">
                  {" "}
                  <span>Size</span>
                </a>
                {arrDetail &&
                  arrDetail.productDetailSize &&
                  arrDetail.productDetailSize.length > 0 &&
                  arrDetail.productDetailSize.map((item, index) => {
                    return (
                      <div
                        onClick={() => handleClickBoxSize(item)}
                        key={index}
                        className={
                          item.id === activeLinkId
                            ? "product-size active"
                            : "product-size"
                        }
                      >
                        {item.sizeData.value}
                      </div>
                    );
                  })}
              </div>
            </li>
            <li>
              <a href="#">{quantity} sản phẩm có sẵn</a>
            </li>
          </ul>

          <p>{arrDetail.description}</p>
          <div style={{ display: "flex" }}>
            <div className="product_count">
              <label htmlFor="qty">Số lượng</label>
              <input
                type="number"
                value={quantityProduct}
                onChange={(event) => setquantityProduct(event.target.value)}
                min="1"

                
              />
            </div>
            <div className="form-group">
              <label
                style={{
                  fontSize: "14px",
                  color: "#797979",
                  fontFamily: '"Roboto",sans-serif',
                  marginLeft: "16px",
                }}
                htmlFor="type"
              >
                Loại sản phẩm
              </label>
              <select
                onChange={(event) => handleSelectDetail(event)}
                className="sorting"
                name="type"
                style={{
                  outline: "none",
                  border: "1px solid #eee",
                  marginLeft: "16px",
                }}
              >
                {dataProduct &&
                  productDetail &&
                  productDetail.length > 0 &&
                  productDetail.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.nameDetail}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>

          <div className="card_area">
            <a className="main_btn" onClick={handleAddShopCart}>
              Thêm vào giỏ
            </a>
            <a className="icon_btn" href="#">
              <i className="lnr lnr lnr-heart" />
            </a>
          </div>
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={imgPreview}
            onCloseRequest={() => setisOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default InfoDetailProduct;
