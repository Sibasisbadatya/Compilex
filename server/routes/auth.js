const {
    login,
    register,
    postCode
  } = require("../controller/userController");
  
  const router = require("express").Router();
  
  router.post("/login", login);
  router.post("/register", register);
  router.post("/code", postCode);

  
  module.exports = router;
  