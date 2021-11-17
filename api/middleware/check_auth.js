// const jwt = require('jsonwebtoken');
// const studentModel = require("../models/students");
// const staffModel = require("../models/staff");
// const employeeModel = require("../models/employees");
// const adminModel = require("../models/admin");

// module.exports = async (req,res,next)=>{
//     try{
//         const token = req.headers.authorization.split(" ")[1];
//         const decoded = jwt.verify(token,process.env.JWT_ADMIN_KEY);
//         req.userData = decoded;
//         const user = await adminModel.findOne({_id:req.userData._id}).select('_id admin_ID name email adminImage').exec();
//         console.log(user)
//         req.userData = user;
//         req.userType = "Admin";
//         next();
//     }
//     catch(err){
//         try{
//             const token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token,process.env.JWT_STAFF_KEY);
//             req.userData = decoded;
//             const user = await staffModel.findOne({_id:req.userData._id}).select().populate('employee').exec();
//             console.log(user)
//             req.userData = user;
//             req.userType = "Staff";
//             next();
//         }
//         catch(err){

//             try{
//                 const token = req.headers.authorization.split(" ")[1];
//                 const decoded = jwt.verify(token,process.env.JWT_EMPLOYEE_KEY);
//                 req.userData = decoded;
//                 const user = await employeeModel.findOne({_id:req.userData._id}).select('_id employee_ID name designation email isApproved isRejected employeeImage creationTime lastUpdated').exec();
//                 console.log(user)
//                 req.userData = user;
//                 req.userType = "employee";
//                 next();
//             }
//             catch(err){
//                 try{
//                     const token = req.headers.authorization.split(" ")[1];
//                     const decoded = jwt.verify(token,process.env.JWT_STUDENT_KEY);
//                     req.userData = decoded;
//                     const user = await studentModel.findOne({_id:req.userData._id}).select('_id name department email course isApproved isRejected studentImage creationTime lastUpdated').exec();
//                     console.log(user)
//                     req.userData = user;
//                     req.userType = "Student";
//                     next();
//                 }
//                 catch(err){

//                         return res.status(401).json({
//                             status:401,
//                             message:"Auth Failed",
//                             error:err
//                         });

//                 }
//             }

//         }
//     }
// };
