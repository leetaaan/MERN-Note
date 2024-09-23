import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
// import admin from "firebase-admin";
// import serviceAccountKey from "./sinh-vien-5tot-firebase-adminsdk-355hd-ac4e4aa098.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
import nodemailer from "nodemailer";
import User from "./Schema/User.js";
import Note from "./Schema/Note.js";

const server = express();
let PORT = 3000;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccountKey),
// });

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});
server.use(cors());

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).json({ error: "Không thể truy cập token" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token không hợp lệ" });
    }

    req.user = user.id;
    next();
  });
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    fullname: user.personal_info.fullname,
  };
};

server.get("/", (req, res) => {
  return res.json("Hello");
});
//user
server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  if (fullname.length < 5) {
    return res.status(403).json({ Lỗi: "Họ và tên phải nhiều hơn 5 ký tự" });
  }
  if (!email.length) {
    return res.status(403).json({ Lỗi: "Nhập email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ Lỗi: "Email không đúng" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      Lỗi: "Mật khẩu phải từ 6 đến 20 ký tự bao gồm ít nhất 1 số, 1 ký tự thường, 1 ký tự hoa",
    });
  }
  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
      },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(500).json({ Lỗi: "Email đã được sử dụng" });
        }
        return res.status(500).json({ Lỗi: err.message });
      });

    console.log(hashed_password);
  });
});

server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ Lỗi: "Email không được tìm thấy" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res
              .status(403)
              .json({ Lỗi: "Lỗi trong khi đăng nhập vui lòng thử lại" });
          }
          if (!result) {
            return res.status(403).json({ Lỗi: "Mật khẩu không đúng" });
          } else {
            return res.status(200).json(formatDatatoSend(user));
          }
        });
      } else {
        return res.status(403).json({
          Lỗi: "Tài khoản đã được tạo bằng Google. Vui lòng thử đăng nhập bằng Google",
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ Lỗi: err.message });
    });
});

server.get("/get-user", verifyJWT, async (req, res) => {
  let user_id = req.user;

  const isUser = await User.findOne({ _id: user_id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
});
// server.post("/google-auth", async (req, res) => {
//   let { access_token } = req.body;

//   getAuth()
//     .verifyIdToken(access_token)
//     .then(async (decodecUser) => {
//       let { email, name, picture } = decodecUser;

//       picture = picture.replace("s96-c", "s384-c");

//       let user = await User.findOne({ "personal_info.email": email })
//         .select(
//           "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
//         )
//         .then((u) => {
//           return u || null;
//         })
//         .catch((err) => {
//           return res.status(500).json({ Lỗi: err.message });
//         });

//       if (user) {
//         if (!user.google_auth) {
//           return res.status(403).json({
//             Lỗi: "Email này đã đăng nhập không dùng Google. Vui lòng đăng nhập lại bằng mật khẩu",
//           });
//         }
//       } else {
//         let username = await generateUsername(email);

//         user = new User({
//           personal_info: {
//             fullname: name,
//             email,
//             username,
//             clas,
//             faculty,
//             dateOfBirth,
//           },
//           google_auth: true,
//         });
//         await user
//           .save()
//           .then((u) => {
//             user = u;
//           })
//           .catch((err) => {
//             return res.status(500).json({ Lỗi: err.message });
//           });
//       }

//       return res.status(200).json(formatDatatoSend(user));
//     })
//     .catch((err) => {
//       return res.status(500).json({
//         err: "Lỗi khi đăng nhập bằng tài khoản Google. Vui lòng thử lại bằng tài khoản khác",
//       });
//     });
// });

// server.post("/change-password", verifyJWT, (req, res) => {
//   let { currentPassword, newPassword } = req.body;

//   if (
//     !passwordRegex.test(currentPassword) ||
//     !passwordRegex.test(newPassword)
//   ) {
//     return res.status(403).json({
//       error:
//         "Mật khẩu phải từ 6 đến 20 ký tự bao gồm ít nhất 1 số, 1 ký tự thường, 1 ký tự hoa",
//     });
//   }

//   User.findOne({ _id: req.user })
//     .then((user) => {
//       if (user.google_auth) {
//         return res.status(403).json({
//           error: "Bạn không thể đổi mật khẩu vì bạn đăng nhập bằng Google",
//         });
//       }

//       bcrypt.compare(
//         currentPassword,
//         user.personal_info.password,
//         (err, result) => {
//           if (err) {
//             return res
//               .status(500)
//               .json({ error: "Đã có lỗi xảy ra, vui lòng thử lại" });
//           }

//           if (!result) {
//             return res.status(500).json({ error: "Mật khẩu cũ không đúng" });
//           }

//           bcrypt.hash(newPassword, 10, (err, hashed_password) => {
//             User.findOneAndUpdate(
//               { _id: req.user },
//               { "personal_info.password": hashed_password }
//             )
//               .then((u) => {
//                 return res.status(200).json({ status: "Đã đổi mật khẩu" });
//               })
//               .catch((err) => {
//                 return res.status(500).json({
//                   error:
//                     "Đã có lỗi xảy ra khi lưu mật khẩu mới, vui lòng thử lại",
//                 });
//               });
//           });
//         }
//       );
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: "Không tìm thấy người dùng" });
//     });
// });

// server.post("/forgot-password", async (req, res) => {
//   let { email } = req.body;
//   User.findOne({ "personal_info.email": email })
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ error: "Tài khoản không tồn tại" });
//       }

//       const token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY, {
//         expiresIn: "1h",
//       });

//       var transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "letan085@gmail.com",
//           pass: "dbxf gjih uyyh kccz",
//         },
//       });

//       const encodedToken = encodeURIComponent(token).replace(/\./g, "");
//       var mailOptions = {
//         from: "sinhvien5tot@gmail.com",
//         to: email,
//         subject: "Đặt lại mật khẩu cho Sinh viên 5 tốt",
//         text: `http://localhost:5173/reset-password/${user._id}/${encodedToken}`,
//       };

//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email sent: " + info.response);
//         }
//       });
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: err.message });
//     });
// });

// server.post("/reset-password/:id/:token", (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
//     if (err) {
//       return res.send({ Status: "Lỗi token" })
//     } else {
//       bcrypt
//         .hash(password, 10)
//         .then((hashPassword) => {
//           User.findByIdAndUpdate(
//             { _id: id },
//             { "personal_info.password": hashPassword }
//           )
//             .then((u) => res.send({ Status: "Success" }))
//             .catch((err) => res.send({ Status: err }));
//         })
//         .catch(res.send({ Status: err }));
//     }
//   });
// });
// blog

server.post("/create-note", verifyJWT, async (req, res) => {
  let authorId = req.user;
  let { title, tags, content, id } = req.body;
  if (!title.length) {
    return res.status(403).json({ error: "Bạn phải cung cấp tiêu đề để đăng" });
  }
  if (!content.length) {
    return res
      .status(403)
      .json({ error: "Bạn phải cung cấp nội dung để đăng" });
  }
  if (!tags.length || tags.length > 5) {
    return res
      .status(403)
      .json({ error: "Bạn phải cung cấp thư viện dưới 5 thư viện để đăng" });
  }
  tags = tags.map((tag) => tag.toLowerCase());
  try {
    let note_id =
      id ||
      title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .trim() + nanoid();

    if (id) {
      Note.findOneAndUpdate(
        { note_id },
        {
          title,
          content,
          tags,
        }
      )
        .then(() => {
          return res.status(200).json({ id: note_id });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    } else {
      let note = new Note({
        title,
        tags,
        content,
        author: authorId,
        note_id,
      });

      await note.save();

      return res.json({ error: false, note, message: "them thanh cong" });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: "loi server" });
  }
});

server.put("/edit-note/:noteId", async (req, res) => {
  let noteId = req.params.noteId;
  let { title, content, tags, isPinned } = req.body;
  let user = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({ error: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId });

    if (!note) {
      return res.status(404).json({ error: "Notes not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.activity.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "note updated",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "loi server",
    });
  }
});

server.get("/get-all-notes", verifyJWT, async (req, res) => {
  let user_id = req.user;

  console.log(req.user); // Check if req.user is defined and has an _id property

  try {
    const notes = await Note.find({ author: user_id }).sort({
      "activity.isPinned": -1,
    });

    return res.json({
      error: false,
      notes,
      message: "note get all",
    });
  } catch (error) {
    console.error(error); // Check the error message
    return res.status(500).json({
      error: true,
      message: "loi server",
    });
  }
});

server.delete("/delete-note/:noteId", verifyJWT, async (req, res) => {
  let user_id = req.user;

  let noteId = req.params.noteId;

  try {
    const note = await Note.findOne({ _id: noteId, author: user_id });

    if (!note) {
      return res.status(404).json({ error: "Notes not found" });
    }
    await Note.findOneAndDelete({ _id: noteId, author: user_id });
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { note: noteId },
        $inc: { "account_info.total_posts": -1 },
      }
    ).then((user) => console.log("Đã xóa"));
    return res.json({
      error: false,
      message: "note delete",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "loi server",
    });
  }
});

server.put("/update-note-pinned/:noteId", verifyJWT, async (req, res) => {
  let noteId = req.params.noteId;
  let { isPinned } = req.body;
  let user_id = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, author: user_id });

    if (!note) {
      return res.status(404).json({ error: "Notes not found" });
    }
    note.activity.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "note updated",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "loi server",
    });
  }
});

server.get("/search-notes/", verifyJWT, async (req, res) => {
  let user_id = req.user;
  let { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }
  try {
    const matchingNotes = await Note.find({
      author: user_id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "note matching",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "loi server",
    });
  }
});
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
