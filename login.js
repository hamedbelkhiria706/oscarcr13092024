const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const SECRET_KEY = "votre_secret";

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  //Similer la vérification d'informations d'authentification
  if (username == "user" && password == "password") {
    const token = jwt.sign({ username, role: "user" }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }
  res.status(401).json({ message: "authentification failed" });
});
app.listen(3000, () =>
  console.log(`Serveur en cours d'éxécution sur le port 3000`)
);
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
    req.user = user;
    next();
  });
};
//Route protegée
app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.username} ` });
});
