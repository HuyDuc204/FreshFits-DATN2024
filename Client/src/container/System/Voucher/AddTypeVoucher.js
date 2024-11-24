import React from 'react';
import { useEffect, useState } from 'react';
import { createNewTypeVoucherService, getDetailTypeVoucherByIdService, updateTypeVoucherService } from '../../../services/userService';

import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useFetchAllcode } from '../../customize/fetch';
import moment from 'moment';
const AddTypeVoucher = (props) => {


    const { data: dataTypeVoucher } = useFetchAllcode('DISCOUNT')
    const [isActionADD, setisActionADD] = useState(true)


    const { id } = useParams();
    const [inputValues, setInputValues] = useState({
        typeVoucher: '', value: '', maxValue: '', minValue: ''
    });
    if (dataTypeVoucher && dataTypeVoucher.length > 0 && inputValues.typeVoucher === '') {

        setInputValues({ ...inputValues, ["typeVoucher"]: dataTypeVoucher[0].code })
    }

    useEffect(() => {

        if (id) {
            let fetchDetailTypeShip = async () => {
                setisActionADD(false)
                let typevoucher = await getDetailTypeVoucherByIdService(id)
                if (typevoucher && typevoucher.errCode === 0) {
                    setInputValues({
                        ...inputValues, ["typeVoucher"]: typevoucher.data.typeVoucher, ["value"]: typevoucher.data.value,
                        ["maxValue"]: typevoucher.data.maxValue, ["minValue"]: typevoucher.data.minValue
                    })
                }
            }
            fetchDetailTypeShip()
        }
    }, [])

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };




    // Kiểm tra dữ liệu đầu vào
const validateInputValues = () => {
    // Kiểm tra không để trống bất kỳ ô input nào
    for (let key in inputValues) {
        if (inputValues[key] === '') {
            toast.error("Vui lòng không để trống các trường");
            return false;
        }
    }

    // Kiểm tra giá trị loại voucher
    if (inputValues.value < 0) {
        toast.error("Giá trị loại voucher không được âm");
        return false;
    }
    if (inputValues.value < 1000) {
        toast.error("Giá trị loại voucher phải trên 1.000 VNĐ");
        return false;
    }
    if (inputValues.value > 5000000) {
        toast.error("Giá trị loại voucher không được vượt quá 5.000.000 VNĐ");
        return false;
    }

    // Kiểm tra giá trị giảm giá phải giống giá trị loại voucher
    if (inputValues.maxValue !== inputValues.value) {
        toast.error("Giảm giá phải giống (Tên giá trị voucher)");
        return false;
    }

    // Kiểm tra giảm giá không âm và không quá 5.000.000 VNĐ
    if (inputValues.minValue < 0 || inputValues.maxValue < 0) {
        toast.error("Các giá trị không được là số âm");
        return false;
    }
    if (inputValues.maxValue > 5000000) {
        toast.error("Giảm giá không được vượt quá 5.000.000 VNĐ");
        return false;
    }

    return true;
};



    let handleSaveTypeVoucher = async () => {

  // Gọi hàm validate
  if (!validateInputValues()) return;


        if (isActionADD === true) {
            let res = await createNewTypeVoucherService({
                typeVoucher: inputValues.typeVoucher,
                value: inputValues.value,
                maxValue: inputValues.maxValue,
                minValue: inputValues.minValue
            })
            if (res && res.errCode === 0) {
                toast.success("Thêm loại voucher thành công")
                setInputValues({
                    ...inputValues,
                    ["typeVoucher"]: '',
                    ["value"]: '',
                    ["maxValue"]: '',
                    ["minValue"]: '',
                })
            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage)
            }
            else toast.error("Thêm loại voucher thất bại")
        } else {
            let res = await updateTypeVoucherService({
                typeVoucher: inputValues.typeVoucher,
                value: inputValues.value,
                maxValue: inputValues.maxValue,
                minValue: inputValues.minValue,
                id: id
            })
            if (res && res.errCode === 0) {
                toast.success("Cập nhật loại voucher thành công")

            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage)
            }
            else toast.error("Cập nhật loại voucher thất bại")
        }
    }


    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại voucher</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD === true ? 'Thêm mới loại voucher' : 'Cập nhật thông tin loại voucher'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Loại voucher</label>
                                <select value={inputValues.typeVoucher} name="typeVoucher" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataTypeVoucher && dataTypeVoucher.length > 0 &&
                                        dataTypeVoucher.map((item, index) => {
                                            return (
                                                <option key={index} value={item.code}>{item.value}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Tên giá trị voucher (VNĐ)</label>
                                <input type="text" value={inputValues.value} name="value" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Đơn tối thiểu</label>
                                <input type="number" value={inputValues.minValue} name="minValue" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Giảm giá </label>
                                <input type="number" value={inputValues.maxValue} name="maxValue" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                        </div>
                        <button type="button" onClick={() => handleSaveTypeVoucher()} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddTypeVoucher;