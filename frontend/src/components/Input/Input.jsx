import React, { useState } from "react";

const Input = ({ value, onChange, placeholder, className, type, icon }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={
          type === "password" ? (isShowPassword ? "text" : "password") : type
        }
        className={className}
      />

      <i className={"fi " + icon + " input-icon"}></i>

      {type === "password" ? (
        <i
          className={
            "fi fi-rr-eye" +
            (isShowPassword ? "-crossed" : "") +
            " input-icon left-[auto] right-4 cursor-pointer"
          }
          onClick={() => setIsShowPassword((currentVal) => !currentVal)}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};

export default Input;
