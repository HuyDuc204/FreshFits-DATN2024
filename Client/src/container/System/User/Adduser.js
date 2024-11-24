import React from "react";
import { useEffect, useState } from "react";
import {
  createNewUser,
  getDetailUserById,
  UpdateUserService,
} from "../../../services/userService";
import DatePicker from "../../../component/input/DatePicker";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useFetchAllcode } from "../../customize/fetch";
import localization from "moment/locale/vi";
import moment from "moment";
const Adduser = (props) => {
  const [birthday, setbirthday] = useState("");

  const [isActionADD, setisActionADD] = useState(true);
  const [isChangeDate, setisChangeDate] = useState(false);
  const { id } = useParams();

  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phonenumber: "",
    genderId: "",
    roleId: "",
    id: "",
    dob: "",
    image: "",
  });

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
      ["image"]: data.image,
    });
    setbirthday(
      moment
        .unix(+data.dob / 1000)
        .locale("vi")
        .format("DD/MM/YYYY")
    );
  };
  useEffect(() => {
    if (id) {
      let fetchUser = async () => {
        setisActionADD(false);
        let user = await getDetailUserById(id);
        if (user && user.errCode === 0) {
          setStateUser(user.data);
        }
      };
      fetchUser();
    }
  }, []);

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

  const { data: dataGender } = useFetchAllcode("GENDER");
  const { data: dataRole } = useFetchAllcode("ROLE");

  if (
    dataGender &&
    dataGender.length > 0 &&
    inputValues.genderId === "" &&
    dataRole &&
    dataRole.length > 0 &&
    inputValues.roleId === ""
  ) {
    console.log(dataRole);
    setInputValues({
      ...inputValues,
      ["genderId"]: dataGender[0].code,
      ["roleId"]: dataRole[0].code,
    });
  }

  let handleOnChangeDatePicker = (date) => {
    setbirthday(date[0]);
    setisChangeDate(true);
  };
  let handleSaveUser = async () => {
  // Kiểm tra lỗi trước khi gửi dữ liệu
  const requiredFields = [
    "email",
  
    "firstName",
    "lastName",
    "phonenumber",
    "image",
    "address",
  

  ];

  let hasError = false;
  let newErrors = {}; // Tạo một đối tượng chứa lỗi cho từng trường

  requiredFields.forEach((field) => {
    if (!inputValues[field]) {
      newErrors[field] = "Trường này không được để trống"; // Thêm lỗi cho trường không hợp lệ
      hasError = true;
    } else {
      newErrors[field] = ""; // Nếu hợp lệ, xóa lỗi trước đó
    }
  });

  setErrors(newErrors); // Cập nhật lỗi vào state

  if (hasError) {
    toast.error("Vui lòng điền đầy đủ thông tin.");
    return;
  }
// Kiểm tra định dạng email
if (inputValues.email && !/\S+@\S+\.\S+/.test(inputValues.email)) {
    toast.error("Email không hợp lệ");
    return;
  }
  
  // Kiểm tra định dạng số điện thoại (10 chữ số)
  if (inputValues.phonenumber && !/^\d{10}$/.test(inputValues.phonenumber)) {
    toast.error("Số điện thoại phải có 10 chữ số");
    return;
  }
  
// Kiểm tra password: chỉ cho phép chữ cái và số
if (inputValues.password && /[^a-zA-Z0-9]/.test(inputValues.password)) {
    toast.error("Mật khẩu chỉ được phép chứa chữ cái và số");
    return;
  }

    //////////////////////
    if (isActionADD === true) {
      let res = await createNewUser({
        email: inputValues.email,
        password: inputValues.password,
        firstName: inputValues.firstName,
        lastName: inputValues.lastName,
        address: inputValues.address,
        roleId: inputValues.roleId,
        genderId: inputValues.genderId,
        phonenumber: inputValues.phonenumber,
        dob: new Date(birthday).getTime(),
        image: inputValues.image,
      });
      if (res && res.errCode === 0) {
        toast.success("Thêm mới người dùng thành công");
        setInputValues({
          ...inputValues,
          ["firstName"]: "",
          ["lastName"]: "",
          ["address"]: "",
          ["phonenumber"]: "",
          ["genderId"]: "",
          ["roleId"]: "",
          ["email"]: "",
          ["image"]: "",
        });
        setbirthday("");
      } else {
        toast.error(res.errMessage);
      }
    } else {
      let res = await UpdateUserService({
        id: inputValues.id,
        firstName: inputValues.firstName,
        lastName: inputValues.lastName,
        address: inputValues.address,
        roleId: inputValues.roleId,
        genderId: inputValues.genderId,
        phonenumber: inputValues.phonenumber,
        dob:
          isChangeDate === false
            ? inputValues.dob
            : new Date(birthday).getTime(),
        image: inputValues.image,
      });
      if (res && res.errCode === 0) {
        toast.success("Cập nhật người dùng thành công");
      } else {
        toast.error(res.errMessage);
      }
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý người dùng</h1>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          {isActionADD === true
            ? "Thêm mới người dùng"
            : "Cập nhật thông tin người dùng"}
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Email</label>
                <input
                  type="email"
                  value={inputValues.email}
                  disabled={isActionADD === true ? false : true}
                  name="email"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Password</label>
                <input
                  type="password"
                  disabled={isActionADD === true ? false : true}
                  name="password"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="inputPassword4"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-4">
                <label htmlFor="inputEmail4">Họ</label>
                <input
                  type="text"
                  value={inputValues.firstName}
                  name="firstName"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
              <div className="form-group col-4">
                <label htmlFor="inputEmail4">Tên</label>
                <input
                  type="text"
                  value={inputValues.lastName}
                  name="lastName"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
              <div className="form-group col-4">
                <label htmlFor="inputEmail4">Số điện thoại</label>
                <input
                  type="text"
                  value={inputValues.phonenumber}
                  name="phonenumber"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
              <div className="form-group col-4">
                <label htmlFor="inputEmail4">ảnh</label>
                <input
                  type="text"
                  value={inputValues.image}
                  name="image"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="inputEmail4"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="inputAddress">Địa chỉ</label>
              <input
                type="text"
                value={inputValues.address}
                name="address"
                onChange={(event) => handleOnChange(event)}
                className="form-control"
                id="inputAddress"
              />
            </div>

            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputCity">Ngày sinh</label>
                <DatePicker
                  className="form-control"
                  onChange={handleOnChangeDatePicker}
                  value={birthday}
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputState">Giới tính</label>
                <select
                  value={inputValues.genderId}
                  name="genderId"
                  onChange={(event) => handleOnChange(event)}
                  id="inputState"
                  className="form-control"
                >
                  {dataGender &&
                    dataGender.length > 0 &&
                    dataGender.map((item, index) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.value}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputZip">Quyền</label>
                <select
                  value={inputValues.roleId}
                  name="roleId"
                  onChange={(event) => handleOnChange(event)}
                  id="inputState"
                  className="form-control"
                >
                  {dataRole &&
                    dataRole.length > 0 &&
                    dataRole.map((item, index) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.value}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSaveUser()}
              className="btn btn-primary"
            >
              Lưu thông tin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Adduser;
