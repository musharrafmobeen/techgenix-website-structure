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
//         const newToken = jwt.sign({
//             email : user.email,
//             _id : user._id
//           },
//           process.env.JWT_ADMIN_KEY,
//           {
//             expiresIn:"1h"
//           })

//         res.status(200).json({
//             status:200,
//             message:"Authentication Successful",
//             token : newToken,
//             userData: user,
//             userType: "Admin"
//         });
//     }
//     catch(err){
//         try{
//             const token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token,process.env.JWT_STAFF_KEY);
//             req.userData = decoded;
//             const user = await staffModel.findOne({_id:req.userData._id}).select().populate('employee').exec();
//             const newToken = jwt.sign({
//                 email : user.employee.email,
//                 _id : user._id
//               },
//               process.env.JWT_STAFF_KEY,
//               {
//                 expiresIn:"1h"
//               })
//             res.status(200).json({
//                 status:200,
//                 message:"Authentication Successful",
//                 token : newToken,
//                 userData: user,
//                 userType: "Staff"
//             });
//         }
//         catch(err){

//             try{
//                 const token = req.headers.authorization.split(" ")[1];
//                 const decoded = jwt.verify(token,process.env.JWT_EMPLOYEE_KEY);
//                 req.userData = decoded;
//                 const user = await employeeModel.findOne({_id:req.userData._id}).select('_id employee_ID name department  designation email isApproved isRejected employeeImage creationTime lastUpdated').exec();
//                 const newToken = jwt.sign({
//                     email : user.email,
//                     _id : user._id
//                   },
//                   process.env.JWT_EMPLOYEE_KEY,
//                   {
//                     expiresIn:"1h"
//                   })
//                 res.status(200).json({
//                     status:200,
//                     message:"Authentication Successful",
//                     token : newToken,
//                     userData: user,
//                     userType: "employee"
//                 });
//             }
//             catch(err){
//                 try{
//                     const token = req.headers.authorization.split(" ")[1];
//                     const decoded = jwt.verify(token,process.env.JWT_STUDENT_KEY);
//                     req.userData = decoded;
//                     const user = await studentModel.findOne({_id:req.userData._id}).select('_id name department email course isApproved isRejected studentImage creationTime lastUpdated').exec();
//                     const newToken = jwt.sign({
//                         email : user.email,
//                         _id : user._id
//                       },
//                       process.env.JWT_STUDENT_KEY,
//                       {
//                         expiresIn:"1h"
//                       })
//                     res.status(200).json({
//                         status:200,
//                         message:"Authentication Successful",
//                         token : newToken,
//                         userData: user,
//                         userType: "Student"
//                     });
//                 }
//                 catch(err){

//                         return res.status(401).json({
//                             status:401,
//                             message:"Authentication Failed, The Token either doesn't match or has expired",
//                             error:err
//                         });

//                 }
//             }

//         }
//     }
// };
