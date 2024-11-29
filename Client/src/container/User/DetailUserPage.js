import React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "../../component/input/DatePicker";
import moment from "moment";
import {
  getDetailUserById,
  UpdateUserService,
  handleSendVerifyEmail,
} from "../../services/userService";
import { useFetchAllcode } from "../../container/customize/fetch";
import CommonUtils from "../../utils/CommonUtils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./DetailUserPage.scss";

function DetailUserPage(props) {
  const { id } = useParams();
  const { data: dataGender } = useFetchAllcode("GENDER");
  const [birthday, setbirthday] = useState("");
  const [isChangeDate, setisChangeDate] = useState(false);
  const [inputValues, setInputValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phonenumber: "",
    genderId: "",
    dob: "",
    roleId: "",
    email: "",
    image: "",
    isActiveEmail: "",
    imageReview: "",
    isOpen: false,
  });
  console.log(dataGender);
  if (dataGender && dataGender.length > 0 && inputValues.genderId === null) {
    setInputValues({ ...inputValues, ["genderId"]: dataGender[0].code });
  }
  useEffect(() => {
    let fetchUser = async () => {
      let res = await getDetailUserById(id);
      if (res && res.errCode === 0) {
        setStateUser(res.data);
      }
    };
    fetchUser();
  }, [id]);

  let setStateUser = (data) => {
    setInputValues({
      ...inputValues,
      ["firstName"]: data.firstName,
      ["lastName"]: data.lastName,
      ["address"]: data.address,
      ["phonenumber"]: data.phonenumber,
      ["genderId"]: data.genderId,
      ["roleId"]: data.roleId,
      ["email"]: data.email,
      ["id"]: data.id,
      ["dob"]: data.dob,
      ["image"]: data.image
        ? data.image
        : "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
      ["isActiveEmail"]: data.isActiveEmail,
    });

    setbirthday(
      moment
        .unix(+data.dob / 1000)
        .locale("vi")
        .format("DD/MM/YYYY")
    );
  };
  /////////////////
  const [errors, setErrors] = useState({});
  const validateField = (name, value) => {
    let error = "";
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  ///////////////
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
    validateField(name, value); // Gọi hàm validate cho từng trường
  };
  let handleOnChangeDatePicker = (date) => {
    setbirthday(date[0]);
    setisChangeDate(true);
  };
  let handleSaveInfor = async () => {
    // Kiểm tra lỗi trước khi gửi dữ liệu
    const requiredFields = ["phonenumber", "firstName", "lastName"];
    let hasError = false;
    requiredFields.forEach((field) => {
      validateField(field, inputValues[field]);
      if (!inputValues[field]) hasError = true;
    });

    if (hasError) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Kiểm tra định dạng số điện thoại (10 chữ số)
    if (inputValues.phonenumber && !/^\d{10}$/.test(inputValues.phonenumber)) {
      toast.error("Số điện thoại phải có 10 chữ số");
      return;
    }

    console.log(inputValues.image);
    let res = await UpdateUserService({
      id: id,
      firstName: inputValues.firstName,
      lastName: inputValues.lastName,
      address: inputValues.address,
      roleId: inputValues.roleId,
      genderId: inputValues.genderId,
      phonenumber: inputValues.phonenumber,
      dob:
        isChangeDate === false ? inputValues.dob : new Date(birthday).getTime(),
      image: inputValues.image,
    });
    if (res && res.errCode === 0) {
      toast.success("Cập nhật người dùng thành công");
    } else {
      toast.error(res.errMessage);
    }
  };
  let handleSendEmail = async () => {
    let res = await handleSendVerifyEmail({
      id: id,
    });
    if (res && res.errCode === 0) {
      toast.success("Vui lòng kiểm tra email !");
    } else {
      toast.error(res.errMessage);
    }
  };
  let handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file?.size > 31312281) {
      toast.error("Dung lượng file bé hơn 30mb");
    } else {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      setInputValues({
        ...inputValues,
        ["image"]: base64,
        ["imageReview"]: objectUrl,
      });
    }
  };
  let openPreviewImage = (url) => {
    setInputValues({
      ...inputValues,
      ["isOpen"]: true,
      ["imageReview"]: url,
    });
  };
  return (
    <div className="container rounded bg-white mt-5 shadow-lg">
      <div className="row">
        {/* Left Profile Section */}
        <div
          className="col-md-4 d-flex flex-column align-items-center p-4"
          style={{
            background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            color: "#495057",
          }}
        >
          <img
            onClick={() => openPreviewImage(inputValues.image)}
            className="rounded-circle shadow"
            height="150px"
            style={{ objectFit: "cover", cursor: "pointer" }}
            width="150px"
            src={inputValues.image}
          />
          <h5 className="mt-3">{inputValues.lastName}</h5>
          <span style={{ color: "#6c757d" }}>{inputValues.email}</span>
        </div>

        {/* Form Section */}
        <div className="col-md-8 bg-light p-5">
          <h3 className="text-center text-primary fw-bold">
            Thông Tin Cá Nhân
          </h3>
          <p className="text-center text-muted mb-4">
            Hãy điền đầy đủ thông tin để chúng tôi hỗ trợ bạn tốt hơn.
          </p>
          <form>
            {/* Name Fields */}
            <div className="row g-4">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label fw-semibold">
                  Họ
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  onChange={(event) => handleOnChange(event)}
                  value={inputValues.firstName}
                  type="text"
                  className="form-control form-control-lg border-primary"
                  placeholder="Nhập họ"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label fw-semibold">
                  Tên
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  onChange={(event) => handleOnChange(event)}
                  value={inputValues.lastName}
                  type="text"
                  className="form-control form-control-lg border-primary"
                  placeholder="Nhập tên"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="mt-4">
              <label htmlFor="phonenumber" className="form-label fw-semibold">
                Số điện thoại
              </label>
              <input
                id="phonenumber"
                name="phonenumber"
                onChange={(event) => handleOnChange(event)}
                value={inputValues.phonenumber}
                type="text"
                className="form-control form-control-lg border-primary"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Gender and Date of Birth */}
            <div className="row g-4 mt-4">
              <div className="col-md-6">
                <label htmlFor="genderId" className="form-label fw-semibold">
                  Giới tính
                </label>
                <select
                  id="genderId"
                  value={inputValues.genderId}
                  name="genderId"
                  onChange={(event) => handleOnChange(event)}
                  className="form-select form-select-lg border-primary"
                >
                  {dataGender &&
                    dataGender.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.value}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="birthday" className="form-label fw-semibold">
                  Ngày sinh
                </label>
                <DatePicker
                  id="birthday"
                  className="form-control form-control-lg border-primary"
                  onChange={handleOnChangeDatePicker}
                  value={birthday}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="mt-4">
              <label htmlFor="previewImg" className="form-label fw-semibold">
                Chọn ảnh đại diện
              </label>
              <input
                type="file"
                id="previewImg"
                accept=".jpg,.png"
                hidden
                onChange={(event) => handleOnChangeImage(event)}
              />
              <label
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                htmlFor="previewImg"
              >
                <i className="fas fa-upload me-2"></i> Tải ảnh
              </label>
            </div>

            {/* Save Button */}
            <div className="text-center mt-5">
              <button
                onClick={() => handleSaveInfor()}
                className="btn btn-primary px-5 py-2 rounded-pill fs-5 shadow"
                type="button"
              >
                Lưu Thông Tin
              </button>
            </div>
          </form>
        </div>
      </div>

      {inputValues.isOpen === true && (
        <Lightbox
          mainSrc={inputValues.imageReview}
          onCloseRequest={() =>
            setInputValues({ ...inputValues, ["isOpen"]: false })
          }
        />
      )}
    </div>
  );
}

export default DetailUserPage;
