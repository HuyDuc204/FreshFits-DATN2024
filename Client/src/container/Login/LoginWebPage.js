
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./LoginWebPage.css";
import {
  handleLoginService,
  checkPhonenumberEmail,
  createNewUser,
} from "../../services/userService";

const LoginWebPage = () => {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "passwordsecrect",
    lastName: "",
    phonenumber: "",
  });
  
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleLogin = async () => {
    if (inputValues.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (/[!@#$%^&*()_+|~=`{}\[\]:;"'<>,.?/\\-]/.test(inputValues.password)) {
      toast.error("Mật khẩu không được chứa các ký tự đặc biệt.");
      return;
    }

    let res = await handleLoginService({
      email: inputValues.email,
      password: inputValues.password,
    });

    if (res && res.errCode === 0) {
      toast.success("Đăng nhập thành công!");
      localStorage.setItem("userData", JSON.stringify(res.user));
      localStorage.setItem("token", JSON.stringify(res.accessToken));
      if (res.user.roleId === "R1" || res.user.roleId === "R4") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleSaveUser = async () => {
    if (inputValues.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (/[!@#$%^&*()_+|~=`{}\[\]:;"'<>,.?/\\-]/.test(inputValues.password)) {
      toast.error("Mật khẩu không được chứa các ký tự đặc biệt.");
      return;
    }
  
    let res = await checkPhonenumberEmail({
      phonenumber: inputValues.phonenumber,
      email: inputValues.email,
    });

    if (res.isCheck === true) {
      toast.error(res.errMessage);
    } else {
      let createUserResponse = await createNewUser({
        email: inputValues.email,
        lastName: inputValues.lastName,
        phonenumber: inputValues.phonenumber,
        password: inputValues.password,
        roleId: "R2",
      });

      if (createUserResponse && createUserResponse.errCode === 0) {
        toast.success("Tạo tài khoản thành công");
        handleLogin(); // Đăng nhập ngay sau khi tạo tài khoản
      } else {
        toast.error(createUserResponse.errMessage);
      }
    }
  };

  return (
    <div className="box-login">
      <div className="login-container">
        <section id="formHolder">
          <div className="row">
            {/* Brand Box */}
            <div className="col-sm-6 brand">
              <div className="heading">
                <h2>Fresh Fits</h2>
                <p>Sự lựa chọn của bạn</p>
              </div>
            </div>
            {/* Form Box */}
            <div className="col-sm-6 form">
              {/* Login Form */}
              {!isRegistering ? (
                <div className="login form-peice">
                  <form
                    className="login-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLogin();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="loginemail">Địa chỉ email</label>
                      <input
                        name="email"
                        onChange={handleOnChange}
                        type="email"
                        id="loginemail"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="loginPassword">Mật khẩu</label>
                      <input
                        name="password"
                        onChange={handleOnChange}
                        type="password"
                        id="loginPassword"
                        required
                      />
                    </div>
                    <div className="CTA">
                      <input type="submit" value="Đăng nhập" />
                      <a
                        style={{ cursor: "pointer" }}
                        className="switch"
                        onClick={() => setIsRegistering(true)}
                      >
                        Tài khoản mới
                      </a>
                    </div>
                  </form>
                </div>
              ) : (
                /* Signup Form */
                <div className="signup form-peice">
                  <form
                    className="signup-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveUser();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="name">Họ và tên</label>
                      <input
                        type="text"
                        name="lastName"
                        onChange={handleOnChange}
                        id="name"
                        className="name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Địa chỉ email</label>
                      <input
                        type="email"
                        name="email"
                        onChange={handleOnChange}
                        id="email"
                        className="email"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        name="phonenumber"
                        onChange={handleOnChange}
                        id="phone"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Mật khẩu</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleOnChange}
                        id="password"
                        className="pass"
                      />
                    </div>
                    <div className="CTA">
                      <input type="submit" value="Đăng ký" />
                      <a
                        style={{ cursor: "pointer" }}
                        className="switch"
                        onClick={() => setIsRegistering(false)}
                      >
                        Tôi có tài khoản
                      </a>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginWebPage;
