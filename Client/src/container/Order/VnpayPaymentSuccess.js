import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { paymentOrderVnpaySuccessService, confirmOrderVnpay } from "../../services/userService";
import { toast } from "react-toastify";
import "./OrderHomePage.scss";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function VnpayPaymentSuccess() {
  let query = useQuery();

  useEffect(() => {
    const objectParam = {
      vnp_Amount: query.get("vnp_Amount"),
      vnp_BankCode: query.get("vnp_BankCode"),
      vnp_BankTranNo: query.get("vnp_BankTranNo"),
      vnp_CardType: query.get("vnp_CardType"),
      vnp_OrderInfo: query.get("vnp_OrderInfo"),
      vnp_PayDate: query.get("vnp_PayDate"),
      vnp_ResponseCode: query.get("vnp_ResponseCode"),
      vnp_TmnCode: query.get("vnp_TmnCode"),
      vnp_TransactionNo: query.get("vnp_TransactionNo"),
      vnp_TransactionStatus: query.get("vnp_TransactionStatus"),
      vnp_TxnRef: query.get("vnp_TxnRef"),
      vnp_SecureHash: query.get("vnp_SecureHash"),
    };

    const confirmPayment = async () => {
      const orderData = JSON.parse(localStorage.getItem("orderData"));
      localStorage.removeItem("orderData");

      if (orderData) {
        const res = await confirmOrderVnpay(objectParam);
        if (res && res.errCode === 0) {
          createNewOrder(orderData);
        }
      }
    };

    confirmPayment();
  }, [query]);

  const createNewOrder = async (data) => {
    const res = await paymentOrderVnpaySuccessService(data);
    if (res && res.errCode === 0) {
      toast.success("Thanh toán hóa đơn thành công");
      const userData = JSON.parse(localStorage.getItem("userData"));
      setTimeout(() => {
        window.location.href = `/user/order/${userData.id}`;
      }, 2000);
    } else {
      toast.error(res.errMessgae);
    }
  };

  return (
    <div className="wrap-order">
      <div className="wrap-heading-order">
        <NavLink to="/" className="navbar-brand logo_h">
          <img src="/resources/img/logo.png" width={90} alt="" />
        </NavLink>
        <span>Thanh Toán VNPAY</span>
      </div>

      <div className="wrap-order-item">
        <section className="cart_area">
          <div className="container">
            <div className="cart_inner">
              <div className="col-md-12">
                <div className="p-3 py-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-right">Loading</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div style={{ width: "100%", height: "100px", backgroundColor: "#f5f5f5" }}></div>
    </div>
  );
}

export default VnpayPaymentSuccess;
