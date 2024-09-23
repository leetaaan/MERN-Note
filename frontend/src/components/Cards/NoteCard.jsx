import moment from "moment";
import React from "react";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className=" flex items-center justify-between">
        <div className="">
          <h6 className=" text-sm font-medium">{title}</h6>
          <span className=" text-xs to-slate-500">
            Ngày tạo {moment(date).format("D/MM/YYYY")}
          </span>
        </div>
        <i
          className={`fi fi-rr-thumbtack icon-btn ${
            isPinned ? "text-primary" : "text-slate-300"
          }`}
          onClick={onPinNote}
        ></i>
      </div>

      <p className="text-xs text-slate-600 mt-2">Nội dung: {content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className=" text-xs text-slate-500">
          {tags.map((item) => ` #${item}`)}
        </div>
        <div className=" flex items-center gap-2">
          <i
            className="fi fi-rr-pen-clip icon-btn hover:text-green-600"
            onClick={onEdit}
          ></i>
          <i
            className="fi fi-rr-trash icon-btn hover:text-red-500"
            onClick={onDelete}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
