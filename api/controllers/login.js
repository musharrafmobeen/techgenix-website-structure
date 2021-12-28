const adminController = require("./admin");
const userController = require("./users");

exports.userlogin = async (req, res, next) => {
  const result = await adminController.Admin_Log_In(req, res, next);
  console.log("result", result);
  if (result !== undefined) {
    await userController.userLogIn(req, res, next);
  }
};
