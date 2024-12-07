import React, { useEffect, useState } from "react";
import { Link, NavLink, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Progress,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import {
  getDetailOrder,
  updateStatusOrderService,
} from "../../services/userService";
import { toast } from "react-toastify";
import storeVoucherLogo from "../../../src/resources/img/storeVoucher.png";
import ShopCartItem from "../../component/ShopCart/ShopCartItem";
import CommonUtils from "../../utils/CommonUtils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
function UserDetailOrder(props) {
  const { id } = useParams();
  const [DataOrder, setDataOrder] = useState({});
  const [imgPreview, setimgPreview] = useState("");
  const [isOpen, setisOpen] = useState(false);

  let price = 0;
  const [priceShip, setpriceShip] = useState(0);

  useEffect(() => {
    loadDataOrder();
  }, []);

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

  return (
    <div className="container my-5">
     
      {/* Thêm thanh trạng thái giao hàng tại đây */}
      <div className="card-header bg-gradient-primary text-white py-3">
        <h5 className="mb-0 text-uppercase fw-bold text-center">Trạng thái</h5>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <div className="delivery-timeline mt-4">
          <div className="timeline">
            {/* Các bước trạng thái */}
            <div
              className={`timeline-step ${
                DataOrder.statusId === "S3" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-receipt"></i>
              <p>Chờ xác nhận </p>
            </div>

            <div
              className={`timeline-connector ${
                DataOrder.statusId !== "S3" ? "active" : ""
              }`}
            ></div>

            <div
              className={`timeline-step ${
                DataOrder.statusId === "S4" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-dollar-sign"></i>
              <p>Chờ lấy hàng</p>
            </div>

            <div
              className={`timeline-connector ${
                DataOrder.statusId !== "S3" && DataOrder.statusId !== "S2"
                  ? "active"
                  : ""
              }`}
            ></div>

            <div
              className={`timeline-step ${
                DataOrder.statusId === "S5" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-truck"></i>
              <p>Đang giao hàng</p>
            </div>

            <div
              className={`timeline-connector ${
                DataOrder.statusId !== "S3" &&
                DataOrder.statusId !== "S4" &&
                DataOrder.statusId !== "S5"
                  ? "active"
                  : ""
              }`}
            ></div>

            <div
              className={`timeline-step ${
                DataOrder.statusId === "S8" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-box"></i>
              <p>Đã giao hàng</p>
            </div>

            <div
              className={`timeline-connector ${
                DataOrder.statusId === "S6" ? "active" : ""
              }`}
            ></div>

            <div
              className={`timeline-step ${
                DataOrder.statusId === "S6" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-check-circle"></i>
              <p>Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kết thúc thanh trạng thái */}

      {/* Thông tin giao hàng */}
      <div className="card mb-4 border-0 shadow rounded-3 overflow-hidden">
        <div className="card-header bg-gradient-primary text-white py-3">
          <h5 className="mb-0 text-uppercase fw-bold text-center">
            Địa Chỉ Nhận Hàng
          </h5>
        </div>
        <div
          style={{ fontSize: "22px", fontWeight: "bold", color: "green" }}
          className="card-body bg-light"
        >
          {DataOrder?.addressUser ? (
            <div className="row gy-3">
              <div className="col-md-6">
                <p className="mb-2">
                  <strong className="">Tên khách hàng:</strong>{" "}
                  <span className="text-primary">
                    {DataOrder.addressUser.shipName}
                  </span>
                </p>
                <p className="mb-2">
                  <strong className="">Số điện thoại:</strong>{" "}
                  <span className="text-primary">
                    {DataOrder.addressUser.shipPhonenumber}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-2">
                  <strong className="">Địa chỉ:</strong>{" "}
                  <span className="text-primary">
                    {DataOrder.addressUser.shipAdress}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-danger fw-semibold fs-5">
                Không có thông tin giao hàng.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chi tiết sản phẩm */}
      <div className="card mb-4">
        <div className="card-header bg-gradient-primary text-white py-3">
          <h5 className="mb-0 text-uppercase fw-bold text-center">
            Chi tiết sản phẩm
          </h5>
        </div>
        <div className="card-body table-responsive">
  <table className="table table-bordered align-middle">
    <thead className="table-light">
      <tr>
          <th scope="col" className="text-center">
          Mã đơn
        </th>
        <th scope="col">Hình ảnh</th> {/* Cột Hình ảnh */}
        <th scope="col">Sản phẩm</th>
        <th scope="col">Giá</th>
        <th scope="col" className="text-center">
          Số lượng
        </th>
        <th scope="col" className="text-center">
          Tổng tiền
        </th>
      
      </tr>
    </thead>
    <tbody>
      {DataOrder.orderDetail &&
        DataOrder.orderDetail.length > 0 &&
        DataOrder.orderDetail.map((item, index) => {
          price += item.quantity * item.productDetail.discountPrice;
          let name = `${item.product.name} - ${item.productDetail.nameDetail} - ${item.productDetailSize.sizeData.value}`;
          return (
            <tr key={index}>
                      <td className="text-center">MD{item.id}</td> {/* Hiển thị Mã đơn */}
              <td>
                <img
                  src={item.productImage[0].image} // Đảm bảo rằng bạn lấy đúng đường dẫn ảnh
                  alt={item.product.name}
                  style={{ width: '150px', height: '140px', objectFit: 'cover' }}
                />
              </td>
              <td>{name}</td>
              <td>{item.productDetail.discountPrice}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">{item.quantity * item.productDetail.discountPrice}</td>
      
            </tr>
          );
        })}
    </tbody>
  </table>
</div>

      </div>

      {/* Phương thức vận chuyển và Voucher */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-info text-white">
              <div className="card-header bg-gradient-primary text-white py-3">
                <h5 className="mb-0 text-uppercase fw-bold text-center">
                  Đơn vị vận chuyển
                </h5>
              </div>
            </div>
            <div
              style={{ height: "100px", fontSize: "18px" }}
              className="card-body "
            >
              {DataOrder && DataOrder.typeShipData && (
                <p>
                  <strong>Loại vận chuyển:</strong>{" "}
                  {DataOrder.typeShipData.type} -{" "}
                  {CommonUtils.formatter.format(DataOrder.typeShipData.price)}{" "}
                  VNĐ
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-warning text-white">
              <div className="card-header bg-gradient-primary text-white py-3">
                <h5 className="mb-0 text-uppercase fw-bold text-center">
                  Voucher
                </h5>
              </div>
            </div>

            <div
              style={{ height: "100px", fontSize: "18px" }}
              className="card-body d-flex  "
            >
              <img
                src={storeVoucherLogo}
                alt="Voucher"
                width="30"
                height="30"
                className="me-3"
              />
              <div>
                <p className="mb-1">
                  <strong>Mã voucher:</strong>{" "}
                  {DataOrder && DataOrder.voucherData && DataOrder.voucherId
                    ? DataOrder.voucherData.codeVoucher
                    : "Không có"}
                </p>
                {DataOrder && DataOrder.voucherData && DataOrder.voucherId && (
                  <p className="mb-0">
                    <strong>Giảm giá:</strong>{" "}
                    {DataOrder.voucherData.typeVoucherOfVoucherData
                      .typeVoucher === "percent"
                      ? `${DataOrder.voucherData.typeVoucherOfVoucherData.value}%`
                      : `${CommonUtils.formatter.format(
                          DataOrder.voucherData.typeVoucherOfVoucherData
                            .maxValue
                        )} VNĐ`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lời nhắn cho người bán */}
      <div className="mb-4">
        <label htmlFor="note" className="form-label fw-bold">
          Lời Nhắn:
        </label>
        <input
          id="note"
          value={DataOrder.note || ""}
          type="text"
          className="form-control"
          placeholder="Lưu ý cho Người bán..."
          readOnly
        />
      </div>

      {/* Thông tin thanh toán */}
      <div className="card mb-4">
        <div className="card-header bg-gradient-primary text-white py-3">
          <h5 className="mb-0 text-uppercase fw-bold text-center">
            Thông tin thanh toán
          </h5>
        </div>
        <div
          className="card-body"
          style={{ fontSize: "20px", fontWeight: "bold" }}
        >
          <div className="mb-3">
            <p>
              <strong> Tổng thanh toán:</strong>{" "}
              {DataOrder &&
                DataOrder.orderDetail &&
                DataOrder.orderDetail.length}{" "}
              sản phẩm:
            </p>

            <p>
              <strong>Tổng tiền hàng:</strong>{" "}
              {CommonUtils.formatter.format(price)} VNĐ
            </p>
            <p>
              <strong>Phí vận chuyển:</strong>{" "}
              {CommonUtils.formatter.format(priceShip)} VNĐ
            </p>
            <p>
              <strong>Tổng giảm giá:</strong> -{" "}
              {DataOrder && DataOrder.voucherData && DataOrder.voucherId
                ? CommonUtils.formatter.format(
                    price - totalPriceDiscount(price, DataOrder.voucherData)
                  )
                : CommonUtils.formatter.format(0)}{" "}
              VNĐ
            </p>
          </div>
          <div className="mt-4">
            <h5
              className=""
              style={{ fontSize: "25px", fontWeight: "bold", color: "green" }}
            >
              <strong>Tổng thanh toán:</strong>{" "}
              {DataOrder && DataOrder.voucherData && DataOrder.voucherId
                ? CommonUtils.formatter.format(
                    totalPriceDiscount(price, DataOrder.voucherData) + priceShip
                  )
                : CommonUtils.formatter.format(price + priceShip)}{" "}
              VNĐ
            </h5>
          </div>
        </div>
      </div>

      {/* Phương thức thanh toán và trạng thái đơn hàng */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-gradient-primary text-white py-3">
              <h5 className="mb-0 text-uppercase fw-bold text-center">
                Phương Thức Thanh Toán
              </h5>
            </div>
            <div
              style={{ height: "110px", fontSize: "30px", marginTop: "20px" }}
              className="card-body text-center "
            >
              <span
                className={`badge ${
                  DataOrder.isPaymentOnlien === 0 ? "bg-danger" : "bg-success"
                }`}
              >
                <i
                  className={`fa ${
                    DataOrder.isPaymentOnlien === 0
                      ? "fa-money-bill-wave"
                      : "fa-credit-card"
                  } me-2`}
                ></i>
                {DataOrder.isPaymentOnlien === 0
                  ? "Thanh toán tiền mặt"
                  : "Thanh toán Online"}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-gradient-primary text-white py-3">
              <h5 className="mb-0 text-uppercase fw-bold text-center ">
                Trạng Thái Đơn Hàng
              </h5>
            </div>
            <div
              style={{ height: "130px", fontSize: "20px" }}
              className="card-body"
            >
              {/* Thanh trạng thái giao hàng */}
              <div className="delivery-status">
                <div className="text-center">
                  <div style={{ marginBottom: "30px", fontWeight: "bold" }}>
                    {/* Chờ lấy hàng */}
                    {DataOrder.statusId === "S7" && (
                      <div className="status-item mb-3">
                        <div className="mt-2 text-danger  ">
                          <i className="me-2 fas fa-clock"> </i>
                          <div>Đã huỷ đơn</div>
                        </div>
                      </div>
                    )}

                    {/* Chờ xác nhận */}
                    {DataOrder.statusId === "S9" && (
                      <div className="status-item mb-3">
                        <div className="mt-2 text-warning  ">
                          <i className="me-2 fas fa-check-circle"> </i>
                          <div>Chưa nhận được hàng</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {DataOrder.statusId === "S4" && (
                    <div className="status-item mb-3">
                      <div className="mt-2 text-warning">
                        <i className="fas fa-clock me-2"></i>Chờ lấy hàng
                      </div>
                    </div>
                  )}

                  {DataOrder.statusId === "S3" && (
                    <div className="status-item mb-3">
                      <div className="mt-2 text-info">
                        <i className="fas fa-check-circle me-2"></i>Chờ xác nhận
                      </div>
                    </div>
                  )}

                  {DataOrder.statusId === "S5" && (
                    <div className="status-item mb-3">
                      <div className="mt-2 text-primary">
                        <i className="fas fa-truck me-2"></i>Đang giao hàng
                      </div>
                    </div>
                  )}

                  {(DataOrder.statusId === "S8" ||
                    DataOrder.statusId === "S6") && (
                    <div className="status-item mb-3">
                      <div className="mt-2 text-success">
                        <i className="fas fa-check-circle me-2"></i>Đã giao hàng
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Kết thúc thanh trạng thái */}
            </div>
          </div>
        </div>
      </div>

      {/* Hình ảnh giao hàng */}

      {/* Thông tin khách hàng */}

      {/* Lightbox cho hình ảnh */}
      {isOpen && (
        <Lightbox
          mainSrc={imgPreview}
          onCloseRequest={() => setisOpen(false)}
        />
      )}
    </div>
  );
}

export default UserDetailOrder;
