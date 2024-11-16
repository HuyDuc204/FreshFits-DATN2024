import React, { useState, useEffect } from "react";
import { getStatisticOverturn } from "../../../services/userService";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import CommonUtils from "../../../utils/CommonUtils";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const Turnover = () => {
  const [dataOrder, setDataOrder] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [type, setType] = useState("day");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateTime, setDateTime] = useState(new Date());

  const fetchStatistics = async () => {
    const res = await getStatisticOverturn({
      oneDate: type === "day" ? dateRange[0] : dateTime,
      twoDate: dateRange[1],
      type,
    });

    if (res?.errCode === 0) {
      setDataOrder(res.data);
      setTotalPrice(res.data.reduce((acc, item) => acc + item.totalpriceProduct, 0));

      const exportData = res.data.map(item => ({
        id: item.id,
        createdAt: moment.utc(item.createdAt).local().format("DD/MM/YYYY HH:mm:ss"),
        updatedAt: moment.utc(item.updatedAt).local().format("DD/MM/YYYY HH:mm:ss"),
        typeShip: item.typeShipData.type,
        codeVoucher: item.voucherData.codeVoucher,
        paymentType: item.isPaymentOnlien === 0 ? "Thanh toán tiền mặt" : "Thanh toán online",
        statusOrder: item.statusOrderData.value,
        totalpriceProduct: item.totalpriceProduct,
      }));
      setDataExport(exportData);
    }
  };

  const handleExport = async () => {
    await CommonUtils.exportExcel(dataExport, "Thống kê doanh thu", "TurnOver");
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Thống kê</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Thống kê doanh thu
        </div>
        <div className="card-body">
          <form>
            <div className="form-group col-md-2">
              <label>Loại thống kê</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-control"
              >
                <option value="day">Ngày</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              {type === "day" ? (
                <DatePicker
                  selectsRange
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={setDateRange}
                  className="form-control"
                  isClearable
                />
              ) : (
                <DatePicker
                  selected={dateTime}
                  onChange={setDateTime}
                  dateFormat={type === "month" ? "MM/yyyy" : "yyyy"}
                  showMonthYearPicker={type === "month"}
                  showYearPicker={type === "year"}
                  className="form-control"
                />
              )}
            </div>
            <button type="button" onClick={fetchStatistics} className="btn btn-primary">
              Lọc
            </button>
          </form>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Ngày cập nhật</th>
                  <th>Loại ship</th>
                  <th>Mã voucher</th>
                  <th>Hình thức</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dataOrder.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{moment.utc(item.createdAt).local().format("DD/MM/YYYY HH:mm:ss")}</td>
                    <td>{moment.utc(item.updatedAt).local().format("DD/MM/YYYY HH:mm:ss")}</td>
                    <td>{item.typeShipData.type}</td>
                    <td>{item.voucherData.codeVoucher}</td>
                    <td>{item.isPaymentOnlien === 0 ? "Thanh toán tiền mặt" : "Thanh toán online"}</td>
                    <td>{item.statusOrderData.value}</td>
                    <td>{CommonUtils.formatter.format(item.totalpriceProduct)}</td>
                    <td>
                      <Link to={`/admin/order-detail/${item.id}`}>Xem chi tiết</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-total" style={{ fontSize: "26px" }}>
            Tổng doanh thu:{" "}
            <span style={{ color: "#71cd14" }}>{CommonUtils.formatter.format(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Turnover;
