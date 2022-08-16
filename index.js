import express from "express";
import { engine } from "express-handlebars";
import mysql from "mysql2/promise";

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));

// const database = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "newDatabase",
// });

const database = await mysql.createConnection({
  host: "pauliuspetrunin.lt",
  user: "bit",
  password: "kulokas",
  database: "Lukas",
});

const port = process.env.PORT || 3000;

//RENDER

app.get("/", async (req, res) => {
  const message = req.query.message;
  const users = await database.query(
    "SELECT id, user_name, email, password FROM users"
  );

  console.log(users[0]);
  res.render("index", {
    users: users[0],
    message,
  });
});

//REGISTER

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { user_name, email, password } = req.body;
  try {
    await database.query(
      "INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)",
      [user_name, email, password]
    );
    res.redirect("/?message=Registration successful");
  } catch (error) {
    console.log(error);
  }
});

//LOGIN

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await database.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (user[0].length > 0) {
      res.redirect("/?message=Sveiki prisijungę");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port);
