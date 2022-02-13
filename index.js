const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const profileRoutes = require("./routes/profile");
const tasksRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");

const session = require("express-session");
const hbs = require("hbs");

const indexPath = path.join(__dirname, "public");

// const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT || 3000;

hbs.registerPartials("./views/partials");

app.set("view engine", "hbs");

app.use(express.static(indexPath));
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "keyboard warrior",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/profile", profileRoutes);
app.use("/tasks", tasksRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

//posting to the sever , body of post(from user/client) passing values if it is matches request body

app.listen(PORT, () => console.log("server is running"));
