import React, { useEffect, useState } from "react";
import { getStatisticProfit } from "../../../services/userService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import CommonUtils from "../../../utils/CommonUtils";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const Profit = () => {
  const [dataOrder, setDataOrder] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [sumPrice, setSumPrice] = useState(0);
  const [type, setType] = useState("day");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [DateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    try {
      const res = await getStatisticProfit({
        oneDate: type === "day" ? startDate : DateTime,
        twoDate: endDate,
        type: type,
      });
      if (res && res.errCode === 0) {
        let sumPrice = 0;
        const formattedData = res.data.map((item) => {
          sumPrice += item.profitPrice;
          return {
            id: item.id,
            createdAt: moment.utc(item.createdAt).local().format("DD/MM/YYYY HH:mm:ss"),
            updatedAt: moment.utc(item.updatedAt).local().format("DD/MM/YYYY HH:mm:ss"),
            typeShip: item.typeShipData.type,
            codeVoucher: item.voucherData.codeVoucher,
            paymentType: item.isPaymentOnlien === 0 ? "Thanh toán tiền mặt" : "Thanh toán online",
            statusOrder: item.statusOrderData.value,
            totalpriceProduct: item.totalpriceProduct,
            importPrice: item.importPrice,
            profitPrice: item.profitPrice,
          };
        });
        setDataOrder(res.data);
        setDataExport(formattedData);
        setSumPrice(sumPrice);
      } else {
        toast.error("Lỗi khi tải dữ liệu.");
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickExport = async () => {
    await CommonUtils.exportExcel(dataExport, "Thống kê lợi nhuận", "Profit");
  };

  useEffect(() => {
    handleOnClick();
  }, [type, startDate, endDate]);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Thống kê</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Thống kê lợi nhuận
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="inputZip">Loại thống kê</label>
                <select
                  value={type}
                  name="type"
                  onChange={(event) => setType(event.target.value)}
                  className="form-control"
                >
                  <option value="day">Ngày</option>
                  <option value="month">Tháng</option>
                  <option value="year">Năm</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              {type === "day" && (
                <div className="form-group col-md-2">
                  <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    className="form-control"
                    isClearable
                  />
                </div>
              )}
              {type === "month" && (
                <div className="form-group col-md-2">
                  <label>Chọn tháng</label>
                  <DatePicker
                    selected={DateTime}
                    onChange={(date) => setDateTime(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className="form-control"
                  />
                </div>
              )}
              {type === "year" && (
                <div className="form-group col-md-2">
                  <label>Chọn năm</label>
                  <DatePicker
                    selected={DateTime}
                    onChange={(date) => setDateTime(date)}
                    dateFormat="yyyy"
                    showYearPicker
                    className="form-control"
                  />
                </div>
              )}
            </div>
            <button type="button" onClick={handleOnClick} className="btn btn-primary">
              Lọc
            </button>
          </form>
        </div>
        <div className="card-body">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div className="table-responsive">
                <table className="table table-bordered">
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
                      <th>Tiền nhập hàng</th>
                      <th>Lợi nhuận</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataOrder.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{moment.utc(item.createdAt).local().format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td>{moment.utc(item.updatedAt).local().format("DD/MM/YYYY HH:mm:ss")}</td>
                        <td>{item.typeShipData.type}</td>
                        <td>{item.voucherData.codeVoucher}</td>
                        <td>{item.isPaymentOnlien === 0 ? "Thanh toán tiền mặt" : "Thanh toán online"}</td>
                        <td>{item.statusOrderData.value}</td>
                        <td>{CommonUtils.formatter.format(item.totalpriceProduct)}</td>
                        <td>{CommonUtils.formatter.format(item.importPrice)}</td>
                        <td>{CommonUtils.formatter.format(item.profitPrice)}</td>
                        <td>
                          <Link to={`/admin/order/${item.id}`}>Chi tiết</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          
              <div className="mt-2">
                Tổng lợi nhuận: {CommonUtils.formatter.format(sumPrice)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profit;
