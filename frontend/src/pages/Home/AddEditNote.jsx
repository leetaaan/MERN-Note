import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNote = ({ noteData, getAllNotes, type, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/create-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Thêm thành công")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Sửa thành công")
        getAllNotes();
        onClose(); 
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }
    if (!content) {
      setError("Vui lòng nhập nội dung");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className=" relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <i className="fi fi-rr-cross-small text-xl text-slate-400"></i>
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Tiêu đề</label>
        <input
          type="text"
          className=" text-2xl to-slate-950"
          placeholder="Nhập tiêu đề"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Nội dung</label>
        <textarea
          type="text"
          className=" text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Nhập Nội dung"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      <div className="mt-3">
        <label className="input-label">Thẻ</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className=" text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "Cập nhật" : "Thêm"}
      </button>
    </div>
  );
};

export default AddEditNote;
