import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Badge,
  Progress,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
} from "react-router-dom";
import "./OrderUser.scss";
import {
  getDetailOrder,
  getAllOrdersByUser,
  updateStatusOrderService,
} from "../../services/userService";
import { concat } from "lodash";
import CommonUtils from "../../utils/CommonUtils";

function OrderUser(props) {
  const { id } = useParams();
  const [DataOrder, setDataOrder] = useState({});

  const [confirmedOrders, setConfirmedOrders] = useState(new Set()); // Thêm state để lưu trữ đơn hàng đã xác nhận
  let price = 0;
  const [priceShip, setpriceShip] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadDataOrder();

    loadConfirmedOrders(); // Tải đơn hàng đã xác nhận từ local storage
  }, []);

  const loadConfirmedOrders = () => {
    const storedOrders = localStorage.getItem("confirmedOrders");
    if (storedOrders) {
      setConfirmedOrders(new Set(JSON.parse(storedOrders)));
    }
  };

  let loadDataOrder = () => {
    if (id) {
      let fetchOrder = async () => {
        let order = await getAllOrdersByUser(id);
        if (order && order.errCode === 0) {
          let orderArray = [];
          for (let i = 0; i < order.data.length; i++) {
            orderArray = concat(orderArray, order.data[i].order);
          }
          // Sắp xếp các đơn hàng theo thời gian tạo (giả sử có thuộc tính createdAt)
          orderArray.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setDataOrder(orderArray);
        }
      };
      fetchOrder();
    }
  };

  const handleCancelOrder = (order, order2) => {
    setSelectedOrder(order, order2);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async (order, reason) => {
    const res = await updateStatusOrderService({
      id: order.id,
      statusId: "S7",
      dataOrder: order,
    });
    if (res && res.errCode === 0) {
      toast.success(`Đã hủy đơn hàng thành công. Lý do: ${reason}`);
      loadDataOrder();

      setShowCancelModal(false);
    }
  };
  const handleReceivedOrder3 = async (orderId) => {
    let res = await updateStatusOrderService({
      id: orderId,
      statusId: "S6",
    });
    if (res && res.errCode === 0) {
      loadDataOrder();
    }
  };
  const handleCancelOrder2 = async (data) => {
    let res = await updateStatusOrderService({
      id: data.id,
      statusId: "S9",
      dataOrder: data,
    });
    if (res && res.errCode === 0) {
      loadDataOrder();
    }
  };

  let totalPriceDiscount = (price, discount) => {
    if (discount.typeVoucherOfVoucherData.typeVoucher === "percent") {
      if (
        (price * discount.typeVoucherOfVoucherData.value) / 100 >
        discount.typeVoucherOfVoucherData.maxValue
      ) {
        return price - discount.typeVoucherOfVoucherData.maxValue;
      } else {
        return price - (price * discount.typeVoucherOfVoucherData.value) / 100;
      }
    } else {
      return price - discount.typeVoucherOfVoucherData.maxValue;
    }
  };

  return (
    <div className="container container-list-order rounded mt-5 mb-5">
      <div className="row">
        <div className="col-md-12">
          <div className="box-nav-order">
            <a className="nav-item-order active">
              <span>Tất cả</span>
            </a>
          </div>

          <div className="box-search-order p-2">
            <i className="fas fa-search"></i>
            <input
              autoComplete="off"
              placeholder="Tìm kiếm theo Tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
              type={"text"}
            />
          </div>

          {DataOrder &&
            DataOrder.length > 0 &&
            DataOrder.map((item, index) => {
              return (
                <div key={index}>
                  <div className="box-list-order">
                    <div className="content-top">
                      <div className="content-left">
                        <div className="label-favorite">Yêu thích</div>
                        <span className="label-name-shop">Fresh Fits shop</span>
                        <div className="view-shop">
                          <i className="fas fa-store"></i>
                          <a style={{ color: "black" }} href="/shop">
                            Xem shop
                          </a>
                        </div>
                      </div>

                      <div className="order-status"></div>
                    </div>
                    <div>
                      <div className="delivery-timeline mt-4">
                        <div className="timeline">
                          {/* Các bước trạng thái */}
                          <div
                            className={`timeline-step ${
                              item.statusId === "S3" ? "active" : ""
                            }`}
                          >
                            <i className="fa-solid fa-receipt"></i>
                            <p>Chờ xác nhận </p>
                          </div>

                          <div
                            className={`timeline-connector ${
                              item.statusId !== "S3" ? "active" : ""
                            }`}
                          ></div>

                          <div
                            className={`timeline-step ${
                              item.statusId === "S4" ? "active" : ""
                            }`}
                          >
                            <i className="fa-solid fa-dollar-sign"></i>
                            <p>Chờ lấy hàng</p>
                          </div>

                          <div
                            className={`timeline-connector ${
                              item.statusId !== "S3" && item.statusId !== "S2"
                                ? "active"
                                : ""
                            }`}
                          ></div>

                          <div
                            className={`timeline-step ${
                              item.statusId === "S5" ? "active" : ""
                            }`}
                          >
                            <i className="fa-solid fa-truck"></i>
                            <p>Đang giao hàng</p>
                          </div>

                          <div
                            className={`timeline-connector ${
                              item.statusId !== "S3" &&
                              item.statusId !== "S4" &&
                              item.statusId !== "S5"
                                ? "active"
                                : ""
                            }`}
                          ></div>

                          <div
                            className={`timeline-step ${
                              item.statusId === "S8" ? "active" : ""
                            }`}
                          >
                            <i className="fa-solid fa-box"></i>
                            <p>Đã giao hàng</p>
                          </div>

                          <div
                            className={`timeline-connector ${
                              item.statusId === "S6" ? "active" : ""
                            }`}
                          ></div>

                          <div
                            className={`timeline-step ${
                              item.statusId === "S6" ? "active" : ""
                            }`}
                          >
                            <i className="fa-solid fa-check-circle"></i>
                            <p>Hoàn thành</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Thêm thanh trạng thái giao hàng tại đây */}

                    <div className="content-top">
                      <div
                        className="d-flex justify-content-between"
                        style={{ width: "100%" }}
                      >
                        <div className="content-left">
                          <div
                            style={{
                              marginBottom: "10px",
                              fontWeight: "bold",
                              fontSize: "20px",
                            }}
                          >
                            {/* Chờ lấy hàng */}
                            {item.statusId === "S7" && (
                              <div className="status-item">
                                <div className="mt-2 text-danger d-flex align-items-center ">
                                  <i className="me-2 fas fa-clock"> </i>
                                  <div>Đã huỷ đơn</div>
                                </div>
                              </div>
                            )}

                            {/* Chờ xác nhận */}
                            {item.statusId === "S9" && (
                              <div className="status-item">
                                <div className="mt-2 text-warning d-flex align-items-center ">
                                  <i className="me-2 fas fa-check-circle"> </i>
                                  <div>Chưa nhận được hàng</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className="wrap-content-address"
                          style={{ textAlign: "right" }}
                        >
                          <div className="content-up">
                            <div className="content-left">
                              <td>
                                <Link
                                  style={{
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                    marginTop: "8px",
                                  }}
                                  to={`/user/userdetail/${item.id}`}
                                >
                                  <i className="me-2 fas fa-map-marker-alt"></i>
                                  Xem chi tiết đơn hàng
                                </Link>
                              </td>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="order-status"></div>
                    </div>
                    {item.orderDetail &&
                      item.orderDetail.length > 0 &&
                      item.orderDetail.map((itemDetail, index) => {
                        price +=
                          itemDetail.quantity *
                          itemDetail.productDetail.discountPrice;
                        return (
                          <div className="content-center" key={index}>
                            <div className="box-item-order">
                              <img
                                src={itemDetail.productImage[0].image}
                                alt={itemDetail.product.name}
                              />
                              <div className="box-des">
                                <span className="name">
                                  {itemDetail.product.name}
                                </span>
                                <span className="type">
                                  Phân loại hàng:{" "}
                                  {itemDetail.productDetail.nameDetail} |{" "}
                                  {itemDetail.productDetailSize.sizeData.value}
                                </span>
                                <span>x{itemDetail.quantity}</span>
                              </div>
                              <div className="box-price">
                                {CommonUtils.formatter.format(
                                  itemDetail.productDetail.discountPrice
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="content-bottom">
                    <div className="up">
                      <span>Tổng số tiền: </span>
                      <span className="name">
                        {item && item.voucherData && item.voucherData.id
                          ? CommonUtils.formatter.format(
                              totalPriceDiscount(price, item.voucherData) +
                                item.typeShipData.price
                            )
                          : CommonUtils.formatter.format(
                              price + +item.typeShipData.price
                            )}
                      </span>
                      <div style={{ display: "none" }}>{(price = 0)}</div>
                    </div>
                    {/* ... */}
                    <div className="down">
                      {(item.statusId === "S3" || item.statusId === "S4") &&
                        (item.isPaymentOnlien === 0 ||
                          item.isPaymentOnlien === 1) && (
                          <div
                            className="btn-buy"
                            onClick={() => handleCancelOrder(item)}
                          >
                            Hủy đơn
                          </div>
                        )}

                      {item.statusId == "S5" && (
                        <div
                          className="alert bg-white text-primary border border-info"
                          role="alert"
                        >
                          Theo dõi đơn hàng
                        </div>
                      )}

                      {item.statusId == "S8" && (
                        <>
                          <div
                            className="btn-buy"
                            onClick={() => handleReceivedOrder3(item.id)}
                          >
                            Đã nhận hàng
                          </div>
                          {item.statusId === "S8" &&
                            (item.isPaymentOnlien === 0 ||
                              item.isPaymentOnlien === 1) && (
                              <div
                                className="btn-buy"
                                onClick={() => handleCancelOrder2(item)}
                              >
                                Chưa nhận được hàng
                              </div>
                            )}
                        </>
                      )}
                    </div>
                    {/* ... */}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        toggle={() => setShowCancelModal(false)}
        centered
      >
        <ModalHeader toggle={() => setShowCancelModal(false)}>
          Lý do hủy đơn hàng
        </ModalHeader>
        <ModalBody>
          {[
            "Tôi muốn cập nhật địa chỉ/sdt nhận hàng",
            "Người bán không trả lời thắc mắc",
            "Thay đổi đơn hàng",
            "Tôi không có nhu cầu mua nữa",
            "Khác lý do",
          ].map((reason, index) => (
            <Button
              key={index}
              variant="outline-danger"
              className="w-100 mb-2"
              onClick={() => confirmCancelOrder(selectedOrder, reason)}
            >
              {reason}
            </Button>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Đóng
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default OrderUser;
