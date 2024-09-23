import React from "react";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className=" flex items-center gap-3">
      <img
        src={userInfo?.personal_info.profile_img}
        className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100"
      />

      <div className="">
        <p className=" text-sm font-medium">{userInfo?.personal_info.fullname}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
