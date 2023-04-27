const express = require("express");
const app = express();
const PORT = 5000;
const userRouter = require("./routers/user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");

const { uploadFile } = require("./routers/s3");

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

app.use("/users", userRouter);

app.post("/images", upload.single("file"), async (req, res) => {
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  console.log(result);
  res.send("Good");
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
