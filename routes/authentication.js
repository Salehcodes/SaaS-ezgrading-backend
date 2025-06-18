const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");

router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user, // includes sub, email, etc. from Auth0 token
  });
});

module.exports = router;
