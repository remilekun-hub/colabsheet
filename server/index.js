// require("dotenv").config();
const io = require("socket.io")(process.env.PORT || 5000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// app.get("/spreadsheets", async (req, res) => {
//   const doc = await db.find({});
//   res.json(doc);
// });

// app.post("/createsheet", async (req, res) => {
//   const doc = await db.create(req.body);
//   res.json(doc);
// });

// async function findorCreateDoc(id, field) {
//   if (id == null || field == null) return;
//   const doc = await db.findById({ _id: id, field: field });
//   if (doc) return doc;
//   return await db.create({ _id: id, field: field, data: [] });
// }

io.on("connection", async (socket) => {
  console.log("server started");
  console.log(process.env);
  console.log(socket.id);

  socket.on("add-col", (data) => {
    socket.broadcast.emit("col-updated", data);
  });
  socket.on("add-row", (data) => {
    socket.broadcast.emit("row-updated", data);
  });
  socket.on("cell-data-change", (data) => {
    socket.broadcast.emit("cell-data-change", data);
  });
});
