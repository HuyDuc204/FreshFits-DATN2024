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
  getAllOrdersByUser,
  updateStatusOrderService,
} from "../../services/userService";
import { concat } from "lodash";
import CommonUtils from "../../utils/CommonUtils";

function OrderUser(props) {
  const { id } = useParams();
  const [DataOrder, setDataOrder] = useState([]);

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

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
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
                        <span className="label-name-shop">Eiser shop</span>
                        <div className="view-shop">
                          <i className="fas fa-store"></i>
                          <a style={{ color: "black" }} href="/shop">
                            Xem shop
                          </a>
                        </div>
                      </div>

                      {/* <div className="content-right text-success bg-light p-2 rounded shadow-sm">
                        <b
                          style={{
                            border: "2px solid rgba(255, 0, 0, 0.5)",
                            borderRadius: "8px",
                            padding: "5px 6px",
                            color: "green",
                          }}
                        >
                          <i class="fa-solid fa-check text-success me-2"></i>
                          {item.statusOrderData &&
                            item.statusOrderData.value}{" "}
                          {item.isPaymentOnlien === 1 && " | Đã thanh toán"}
                        </b>
                      </div> */}

                      <div className="order-status">
                        <b
                          style={{
                            border: "2px solid rgba(255, 0, 0, 0.5)",
                            borderRadius: "8px",
                            padding: "5px 6px",
                            color: "green",
                          }}
                        >
                          <i className="fa-solid fa-check text-success me-2"></i>
                          {item.statusOrderData && item.statusOrderData.value}{" "}
                          {item.isPaymentOnlien === 1 && " "}
                        </b>

                      {/* Thêm thanh trạng thái giao hàng tại đây */}
<div className="delivery-status mt-4">
  <div className="text-center">
    {/* Chờ lấy hàng */}
    {item.statusId === "S4" && (
      <div className="status-item">
        <Progress value={20} className="mt-2" color="warning" />
        <div className="mt-2 text-warning">
          <i className="fas fa-clock"></i>
          <div>Chờ lấy hàng</div>
        </div>
      </div>
    )}

    {/* Chờ xác nhận */}
    {item.statusId === "S3" && (
      <div className="status-item">
        <Progress value={40} className="mt-2" color="info" />
        <div className="mt-2 text-info">
          <i className="fas fa-check-circle"></i>
          <div>Chờ xác nhận</div>
        </div>
      </div>
    )}

    {/* Đang giao hàng */}
    {item.statusId === "S5" && (
      <div className="status-item">
        <Progress value={60} className="mt-2" color="primary" />
        <div className="mt-2 text-primary">
          <i className="fas fa-truck"></i>
          <div>Đang giao hàng</div>
        </div>
      </div>
    )}

    {/* Đã giao hàng */}
    {(item.statusId === "S8" || item.statusId === "S6") && (
      <div className="status-item">
        <Progress value={100} className="mt-2" color="success" />
        <div className="mt-2 text-success">
          <i className="fas fa-check-circle"></i>
          <div>Đã giao hàng</div>
        </div>
      </div>
    )}
  </div>
</div>
{/* Kết thúc thanh trạng thái */}

                      </div>
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
                            Xác nhận đã nhận hàng
                          </div>
                          {item.statusId === "S8" &&
                            (item.isPaymentOnlien === 0 ||
                              item.isPaymentOnlien === 1) && (
                              <div
                                className="btn-buy"
                                onClick={() => handleCancelOrder2(item)}
                              >
                                Chưa nhận
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
