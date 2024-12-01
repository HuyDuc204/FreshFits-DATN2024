import React from "react";
import { useEffect, useState } from "react";
import { getDetailAddressUserByIdService } from "../../services/userService";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from "reactstrap";

const AddressUsersModal = (props) => {
  const [inputValues, setInputValues] = useState({
    shipName: "",
    shipAdress: "",
    shipEmail: "",
    shipPhonenumber: "",
    isActionUpdate: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let id = props.addressUserId;
    if (id) {
      let fetchDetailAddress = async () => {
        let res = await getDetailAddressUserByIdService(id);
        if (res && res.errCode === 0) {
          setInputValues({
            ...inputValues,
            isActionUpdate: true,
            shipName: res.data.shipName,
            shipAdress: res.data.shipAdress,
            shipEmail: res.data.shipEmail,
            shipPhonenumber: res.data.shipPhonenumber,
          });
        }
      };
      fetchDetailAddress();
    }
  }, [props.isOpenModal]);

  const validateFields = () => {
    let validationErrors = {};

    if (!inputValues.shipName.trim()) {
      validationErrors.shipName = "Họ và tên không được để trống.";
    }
    if (!inputValues.shipPhonenumber.trim()) {
      validationErrors.shipPhonenumber = "Số điện thoại không được để trống.";
    } else if (!/^\d{10}$/.test(inputValues.shipPhonenumber)) {
      validationErrors.shipPhonenumber = "Số điện thoại phải là 10 chữ số.";
    }
    if (!inputValues.shipEmail.trim()) {
      validationErrors.shipEmail = "Email không được để trống.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        inputValues.shipEmail
      )
    ) {
      validationErrors.shipEmail = "Email không hợp lệ.";
    }
    if (!inputValues.shipAdress.trim()) {
      validationErrors.shipAdress = "Địa chỉ cụ thể không được để trống.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error khi người dùng sửa trường
  };

  let handleCloseModal = () => {
    props.closeModaAddressUser();
    setInputValues({
      shipName: "",
      shipAdress: "",
      shipEmail: "",
      shipPhonenumber: "",
      isActionUpdate: false,
    });
    setErrors({});
  };

  let handleSaveInfor = () => {
    if (validateFields()) {
      props.sendDataFromModalAddress({
        shipName: inputValues.shipName,
        shipAdress: inputValues.shipAdress,
        shipEmail: inputValues.shipEmail,
        shipPhonenumber: inputValues.shipPhonenumber,
        id: props.addressUserId,
        isActionUpdate: inputValues.isActionUpdate,
      });
      handleCloseModal();
    }
  };

  return (
    <div className="">
      <Modal
        isOpen={props.isOpenModal}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Địa chỉ mới</h5>
          <button
            onClick={handleCloseModal}
            type="button"
            className="btn btn-time"
            aria-label="Close"
          >
            X
          </button>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>Họ và tên</label>
              <input
                value={inputValues.shipName}
                name="shipName"
                onChange={(event) => handleOnChange(event)}
                type="text"
                className="form-control"
              />
              {errors.shipName && (
                <small className="text-danger">{errors.shipName}</small>
              )}
            </div>
            <div className="col-6 form-group">
              <label>Số điện thoại</label>
              <input
                value={inputValues.shipPhonenumber}
                name="shipPhonenumber"
                onChange={(event) => handleOnChange(event)}
                type="text"
                className="form-control"
              />
              {errors.shipPhonenumber && (
                <small className="text-danger">{errors.shipPhonenumber}</small>
              )}
            </div>
            <div className="col-12 form-group">
              <label>Email</label>
              <input
                value={inputValues.shipEmail}
                name="shipEmail"
                onChange={(event) => handleOnChange(event)}
                type="text"
                className="form-control"
              />
              {errors.shipEmail && (
                <small className="text-danger">{errors.shipEmail}</small>
              )}
            </div>
            <div className="col-12 form-group">
              <label>Địa chỉ cụ thể</label>
              <input
                value={inputValues.shipAdress}
                name="shipAdress"
                onChange={(event) => handleOnChange(event)}
                type="text"
                className="form-control"
              />
              {errors.shipAdress && (
                <small className="text-danger">{errors.shipAdress}</small>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveInfor}>
            Lưu thông tin
          </Button>{" "}
          <Button onClick={handleCloseModal}>Hủy</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddressUsersModal;
