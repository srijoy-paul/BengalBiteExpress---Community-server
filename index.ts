import bodyParser from "body-parser";
const express = require("express");
const app = express();
const cors = require("cors");
const postsRouter = require("./Routes/PostRoutes");
const PORT = 3001;

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/health", (req: any, res: any) => {
  try {
    res.send({ message: "Server health is ok" });
  } catch (error) {}
});

app.use("/api/v1/posts", postsRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
