import React from "react";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Tìm kiếm ghi chú"
        className=" w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <i
          className="fi fi-rr-cross-small text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}
        ></i>
      )}
      <i
        className="fi fi-rr-search text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      ></i>
    </div>
  );
};

export default SearchBar;
