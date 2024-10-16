import React from 'react';
import { Link } from "react-router-dom";
import orderLogo from '../../../src/resources/img/orderLogo.png';
import storeVoucherLogo from '../../../src/resources/img/storeVoucher.png';

function CategoryUser(props) {
    return (
        <div className="col-md-3">
            <div className="card">
                <div className="card-header text-center">
                    <h5 className="mb-0">Danh mục</h5>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <i className="far fa-user" style={{ color: '#1e5bb8' }}></i>
                        <Link to={`/user/detail/${props.id}`} className="ms-2">Tài khoản của tôi</Link>
                        <ul className="list-unstyled mt-2">
                            <li>
                                <Link to={`/user/detail/${props.id}`} className="text-decoration-none">Hồ sơ</Link>
                            </li>
                            <li>
                                <Link to={`/user/address/${props.id}`} className="text-decoration-none">Địa chỉ</Link>
                            </li>
                            <li>
                                <Link to={`/user/changepassword/${props.id}`} className="text-decoration-none">Đổi mật khẩu</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="list-group-item">
                        <img src={orderLogo} alt="Order Logo" width="20" height="20" className="me-2" />
                        <Link to={`/user/order/${props.id}`} className="text-decoration-none">Đơn mua</Link>
                    </li>
                    <li className="list-group-item">
                        <img src={storeVoucherLogo} alt="Store Voucher Logo" width="20" height="20" className="me-2" />
                        <Link to={`/user/store-voucher/${props.id}`} className="text-decoration-none">Kho voucher</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default CategoryUser;
