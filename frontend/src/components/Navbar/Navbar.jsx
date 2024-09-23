import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import Logo from "../../assets/logo.png";
const Navbar = ({ userInfo , onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear()
    navigate("/sign-in");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch()
  };

  return (
    <div className=" bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <img src={Logo} className="  w-24 font-medium text-black py-2"></img>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
