import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  const handleCancelOrder = (data) => {
    const reasons = [
      "Tôi muốn cập nhật địa chỉ/sdt nhận hàng",
      "Người bán không trả lời thắc mắc / yêu cầu của tôi",
      "Thay đổi đơn hàng(màu sắc, kích thước, thêm mã giảm,...)",
      "Tôi không không có nhu cầu mua nữa",
      "Khác lý do",
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

  let handleReceivedOrder = async (orderId) => {
    let res = await updateStatusOrderService({
      id: orderId,
      statusId: "S8",
    });
    if (res && res.errCode == 0) {
      toast.success("Đã nhận đơn hàng");
      loadDataOrder();
    }
  };

  let handleReceivedOrder3 = async (orderId) => {
    let res = await updateStatusOrderService({
      id: orderId,
      statusId: "S6",
    });
    if (res && res.errCode == 0) {
      toast.success("Xác nhận đã nhận đơn hàng thành công");
      loadDataOrder();
    }
  };

  let handleCancelOrder2 = async (data) => {
    toast.success(
      <div>
        Bạn chưa nhận được hàng! Vui lòng kiểm tra lại.
        <div>
          <button
            onClick={async () => {
              // Xử lý xác nhận
              let res = await updateStatusOrderService({
                id: data.id,
                statusId: "S9",
                dataOrder: data,
              });
              if (res && res.errCode === 0) {
                toast.success("Đã xác nhận bạn chưa nhận được hàng.");
                loadDataOrder();
              }
            }}
            style={{
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              marginRight: "5px",
              cursor: "pointer",
            }}
          >
            Xác nhận
          </button>
          <button
            onClick={() => {
              // Xử lý hủy
              toast.info("Hủy hành động xác nhận.");
            }}
            style={{
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
        </div>
      </div>,
      { position: "top-center", autoClose: false }
    );
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
                          {item.statusOrderData &&
                            item.statusOrderData.value}{" "}
                          {item.isPaymentOnlien === 1 && " | Đã thanh toán"}
                        </b>
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
    </div>
  );
}

export default OrderUser;
