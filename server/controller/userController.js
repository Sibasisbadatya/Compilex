const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    console.log("yes");
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    console.log("yes register");
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.postCode = async (req, res, next) => {
  try {
    const { language, status, stdin, stdout, source_code } = req.body.data;
    const uid = req.body.uid;
    console.log("uid");
    // console.log(stdout);
    // console.log(uid);
    const push = await User.updateOne(
      { _id: uid }, { $push: { codeData: { language, source_code, stdout, status, stdin } } }
    )
    if (push)
      console.log("added");
    else
      console.log("not added");
  } catch (ex) {
    next(ex);
  }
};
