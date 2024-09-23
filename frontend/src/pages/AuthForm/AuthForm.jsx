import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
const AuthForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Vui lòng nhập E-mail hợp lệ.");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/signin", {
        email: email,
        password: password,
      });
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/home");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Có lỗi không mong muốn đã xảy ra. Vui lòng thử lại");
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Vui lòng nhập họ và tên");
      return;
    }
    if (!validateEmail(email)) {
      setError("Vui lòng nhập E-mail hợp lệ.");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/signup", {
        fullname: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Có lỗi không mong muốn đã xảy ra. Vui lòng thử lại");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className=" w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={type === "sign-in" ? handleSignIn : handleSignUp}>
            <h4 className=" text-2xl mb-7">
              {type === "sign-in" ? "Đăng nhập" : "Đăng ký"}
            </h4>
            {type === "sign-up" ? (
              <Input
                className={"input-box"}
                type={"text"}
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder={"Họ và tên"}
                icon={"fi-rr-user"}
              />
            ) : (
              ""
            )}
            <Input
              className={"input-box"}
              type={"email"}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder={"E-mail"}
              icon={"fi-rr-at"}
            />
            <Input
              className={"input-box"}
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder={"Mật khẩu"}
              icon={"fi-rr-lock"}
            />

            {error && <p className=" text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Đăng nhập
            </button>

            {type === "sign-in" ? (
              <p className=" text-sm text-center mt-4">
                Chưa đăng ký?{" "}
                <Link
                  to={"/sign-up"}
                  className=" font-medium text-primary underline"
                >
                  Tạo tài khoản
                </Link>
              </p>
            ) : (
              <p className=" text-sm text-center mt-4">
                Đã có tài khoản{" "}
                <Link
                  to={"/sign-in"}
                  className=" font-medium text-primary underline"
                >
                  Đăng nhập
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
