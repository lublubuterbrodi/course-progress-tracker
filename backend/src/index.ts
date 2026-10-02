import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import courseRoutes from "./routes/courses.js";
import lessonRoutes from "./routes/lessons.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Course Progress Tracker API is running");
});

app.use(courseRoutes);
app.use(lessonRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});