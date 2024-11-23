const express = require("express");
const app = express();

app.get("/callback", (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    console.log("Authorization Code:", code);
    res.send("Authorization successful! You can close this window.");
});

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
});
