import React, { useEffect, useState } from "react";
import { Link, NavLink, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDetailOrder,
  updateStatusOrderService,
} from "../../../services/userService";
import "./../../Order/OrderHomePage.scss";
import { toast } from "react-toastify";
import storeVoucherLogo from "../../../../src/resources/img/storeVoucher.png";
import ShopCartItem from "../../../component/ShopCart/ShopCartItem";
import CommonUtils from "../../../utils/CommonUtils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
function DetailOrder(props) {
  const { id } = useParams();
  const [DataOrder, setDataOrder] = useState({});
  const [imgPreview, setimgPreview] = useState("");
  const [isOpen, setisOpen] = useState(false);
  let price = 0;
  const [priceShip, setpriceShip] = useState(0);
  useEffect(() => {
    loadDataOrder();
  }, []);
  let openPreviewImage = (url) => {
    setimgPreview(url);
    setisOpen(true);
  };
  let loadDataOrder = () => {
    if (id) {
      let fetchOrder = async () => {
        let order = await getDetailOrder(id);
        if (order && order.errCode == 0) {
          setDataOrder(order.data);
          setpriceShip(order.data.typeShipData.price);
        }
      };
      fetchOrder();
    }
  };
  let totalPriceDiscount = (price, discount) => {
    try {
      if (discount.typeVoucherOfVoucherData.typeVoucher === "percent") {
        if (
          (price * discount.typeVoucherOfVoucherData.value) / 100 >
          discount.typeVoucherOfVoucherData.maxValue
        ) {
          return price - discount.typeVoucherOfVoucherData.maxValue;
        } else {
          return (
            price - (price * discount.typeVoucherOfVoucherData.value) / 100
          );
        }
      } else {
        return price - discount.typeVoucherOfVoucherData.maxValue;
      }
    } catch (error) {}
  };
  let handleAcceptOrder = async () => {
    let res = await updateStatusOrderService({
      id: DataOrder.id,
      statusId: "S4",
    });
    if (res && res.errCode == 0) {
      toast.success("Xác nhận đơn hàng thành công");
      loadDataOrder();
    }
  };

  let handleSendProduct = async () => {
    let res = await updateStatusOrderService({
      id: DataOrder.id,
      statusId: "S5",
    });
    if (res && res.errCode == 0) {
      toast.success("Xác nhận gửi hàng thành công");
      loadDataOrder();
    }
  };
  let handleSuccessShip = async () => {
    let res = await updateStatusOrderService({
      id: DataOrder.id,
      statusId: "S6",
    });
    if (res && res.errCode == 0) {
      toast.success("Đã giao hàng thành công");
      loadDataOrder();
    }
  };

  const handleCancelOrder = (data) => {
    const reasons = [
      "Thay đổi trong chính sách vận chuyển",
      "Vấn đề với phương thức thanh toán",
      "Lỗi giá",
      "Nguyên nhân kỹ thuật",
      "Hết hàng",
      "Thông tin giao hàng không chính xác",
    ];

    toast.info(
      <div>
        <p>Vui lòng chọn lý do hủy đơn:</p>
        {reasons.map((reason, index) => (
          <button
            key={index}
            onClick={() => confirmCancelOrder(data, reason)}
            style={{
              display: "block",
              margin: "5px 0",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {reason}
          </button>
        ))}
      </div>,
      { position: "top-center", autoClose: false }
    );
  };
  const confirmCancelOrder = async (data, reason) => {
    let res = await updateStatusOrderService({
      id: data.id,
      statusId: "S7",
      dataOrder: data,
    });
    if (res && res.errCode === 0) {
      toast.success(`Hủy đơn hàng thành công. Lý do: ${reason}`);
      loadDataOrder();
    }
  };

  return (
    <>
      <div className="wrap-order">
        <div className="wrap-heading-order">
          <NavLink to="/" className="navbar-brand logo_h">
            <img src="/resources/img/logo.png" width={100} alt="" />
          </NavLink>
          <span>Chi tiết đơn hàng</span>
        </div>
        <div className="wrap-address-order">
          <div className="border-top-address-order"></div>
          <div className="wrap-content-address">
            <div className="content-up">
              <div className="content-left">
                <i className="fas fa-map-marker-alt"></i>
                <span>Địa Chỉ Nhận Hàng</span>
              </div>
            </div>
            <div className="content-down">
              {DataOrder && DataOrder.addressUser && (
                <>
                  <div className="content-left">
                    <span>
                      {DataOrder.addressUser.shipName} (
                      {DataOrder.addressUser.shipPhonenumber})
                    </span>
                  </div>
                  <div className="content-center">
                    <span>{DataOrder.addressUser.shipAdress}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="wrap-order-item">
          <section className="cart_area">
            <div className="container">
              <div className="cart_inner">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Sản phẩm</th>
                        <th scope="col">Giá</th>
                        <th style={{ textAlign: "center" }} scope="col">
                          Số lượng
                        </th>
                        <th style={{ textAlign: "center" }} scope="col">
                          Tổng tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DataOrder.orderDetail &&
                        DataOrder.orderDetail.length > 0 &&
                        DataOrder.orderDetail.map((item, index) => {
                          price +=
                            item.quantity * item.productDetail.discountPrice;

                          let name = `${item.product.name} - ${item.productDetail.nameDetail} - ${item.productDetailSize.sizeData.value}`;
                          return (
                            <ShopCartItem
                              isOrder={true}
                              id={item.id}
                              productdetailsizeId={item.productDetailSize.id}
                              key={index}
                              name={name}
                              price={item.productDetail.discountPrice}
                              quantity={item.quantity}
                              image={item.productImage[0].image}
                            />
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="box-shipping">
                <h6>Đơn vị vận chuyển</h6>
                <div>
                  {DataOrder && DataOrder.typeShipData && (
                    <label className="form-check-label">
                      {DataOrder.typeShipData.type} -{" "}
                      {CommonUtils.formatter.format(
                        DataOrder.typeShipData.price
                      )}{" "}
                    </label>
                  )}
                </div>
              </div>
              <div className="box-shopcart-bottom">
                <div className="content-left">
                  <div className="wrap-voucher">
                    <img
                      width="20px"
                      height="20px"
                      style={{ marginLeft: "-3px" }}
                      src={storeVoucherLogo}
                    ></img>
                    <span className="name-easier">Easier voucher</span>

                    <span className="choose-voucher">
                      Mã voucher:{" "}
                      {DataOrder &&
                        DataOrder.voucherData &&
                        DataOrder.voucherData.codeVoucher}
                    </span>
                  </div>
                  <div className="wrap-note">
                    <span>Lời Nhắn:</span>
                    <input
                      value={DataOrder.note}
                      type="text"
                      placeholder="Lưu ý cho Người bán..."
                    />
                  </div>
                </div>

                <div className="content-right">
                  <div className="wrap-price">
                    <span className="text-total">
                      Tổng thanh toán{" "}
                      {DataOrder &&
                        DataOrder.orderDetail &&
                        DataOrder.orderDetail.length}{" "}
                      sản phẩm:{" "}
                    </span>
                    <span className="text-price">
                      {DataOrder && DataOrder.voucherData && DataOrder.voucherId
                        ? CommonUtils.formatter.format(
                            totalPriceDiscount(price, DataOrder.voucherData) +
                              priceShip
                          )
                        : CommonUtils.formatter.format(price + +priceShip)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="wrap-payment">
          <div className="content-top" style={{ display: "flex", gap: "10px" }}>
            <span>Phương Thức Thanh Toán</span>

            <div className="content-right text-success bg-light p-2 rounded shadow-sm">
              <b
                style={{
                  border: "2px solid rgba(255, 0, 0, 0.5)",
                  borderRadius: "8px",
                  padding: "5px 6px",
                  color: "#00bfff",
                }}
              >
                <i class="fa-brands fa-amazon-pay me-2"></i>
                {DataOrder.isPaymentOnlien == 0
                  ? "Thanh toán tiền mặt"
                  : "Thanh toán Online"}
              </b>
            </div>
          </div>
          <div className="content-top" style={{ display: "flex", gap: "10px" }}>
            <span>Trạng Thái Đơn Hàng</span>

            <div className="content-right text-success bg-light p-2 rounded shadow-sm">
              <b
                style={{
                  border: "2px solid rgba(255, 0, 0, 0.5)",
                  borderRadius: "8px",
                  padding: "5px 6px",
                  color: "green",
                }}
              >
                <i class="fa-solid fa-check text-success me-2"></i>
                <span>
                  {DataOrder.statusOrderData && DataOrder.statusOrderData.value}
                </span>
              </b>
            </div>
          </div>
          <div className="content-top" style={{ display: "flex", gap: "10px" }}>
            <span>Hình ảnh giao hàng</span>
            <div
              className="box-img-preview"
              style={{
                backgroundImage: `url(https://lh4.googleusercontent.com/becnmXhPSWn72klWuQweC9bQi4-IPwJnLPM9lcZaMyZI4d-2Z0ZrJoJeugNQe7ZiiHJtZPqp1ErmSyT_TDDXxSTM4u0u4GQA6svVwxgsq1qQ4PC57H5N4-5paIgi9QPd6OQkeypZ)`,
                width: "200px",
                height: "200px",
                borderRadius: "10px",
              }}
            ></div>
          </div>
          <div className="content-bottom">
            {DataOrder && DataOrder.addressUser && (
              <div className="wrap-bottom">
                <div className="box-flex">
                  <div className="head">Tên khách hàng</div>
                  <div>{DataOrder.addressUser.shipName}</div>
                </div>
                <div className="box-flex">
                  <div className="head">Số điện thoại</div>
                  <div>{DataOrder.addressUser.shipPhonenumber}</div>
                </div>
                <div className="box-flex">
                  <div className="head">Địa chỉ email</div>
                  <div>{DataOrder.addressUser.shipEmail}</div>
                </div>
              </div>
            )}

            <div className="wrap-bottom">
              <div className="box-flex">
                <div className="head">Tổng tiền hàng</div>
                <div>{CommonUtils.formatter.format(price)}</div>
              </div>
              <div className="box-flex">
                <div className="head">Tổng giảm giá</div>
                <div>
                  {DataOrder && DataOrder.voucherData && DataOrder.voucherId
                    ? CommonUtils.formatter.format(
                        price - totalPriceDiscount(price, DataOrder.voucherData)
                      )
                    : CommonUtils.formatter.format(0)}
                </div>
              </div>
              <div className="box-flex">
                <div className="head">Phí vận chuyển</div>
                <div>{CommonUtils.formatter.format(priceShip)}</div>
              </div>

              <div className="box-flex">
                <div className="head">Tổng thanh toán:</div>
                <div className="money">
                  {DataOrder && DataOrder.voucherData && DataOrder.voucherId
                    ? CommonUtils.formatter.format(
                        totalPriceDiscount(price, DataOrder.voucherData) +
                          priceShip
                      )
                    : CommonUtils.formatter.format(price + +priceShip)}
                </div>
              </div>
              <div className="box-flex">
                {DataOrder && DataOrder.statusId == "S3" && (
                  <a onClick={() => handleAcceptOrder()} className="main_btn">
                    Xác nhận đơn
                  </a>
                )}
                {DataOrder && DataOrder.statusId == "S4" && (
                  <a onClick={() => handleSendProduct()} className="main_btn">
                    Gửi hàng
                  </a>
                )}
                {DataOrder && DataOrder.statusId == "S5" && (
                  <a onClick={() => handleSuccessShip()} className="main_btn">
                    Đã giao hàng
                  </a>
                )}
              </div>
              {DataOrder && (
  (DataOrder.statusId === "S3" && (DataOrder.isPaymentOnlien === 0 || DataOrder.isPaymentOnlien === 1)) && (
    <a
      onClick={() => handleCancelOrder(DataOrder)}
      style={{
        marginLeft: "30px",
        background: "#cd2b14",
        border: "1px solid #cd2b14",
        width: "213px",
      }}
      className="main_btn"
    >
      Hủy đơn
    </a>
  )
)}




            </div>
          </div>
        </div>
      </div>
      <div
        style={{ width: "100%", height: "100px", backgroundColor: "#f5f5f5" }}
      ></div>

      {isOpen === true && (
        <Lightbox
          mainSrc={imgPreview}
          onCloseRequest={() => setisOpen(false)}
        />
      )}
    </>
  );
}

export default DetailOrder;
