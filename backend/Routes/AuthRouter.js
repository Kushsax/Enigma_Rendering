import  express  from "express";
const router = express.Router();
import  {loginValidation, signupValidation}  from "../middleware/AuthValidation.js";
import { login, signup } from "../controllers/AuthController.js";

// router.post('/login',(req,res)=>{
//   res.send("Login success");
// })
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

export default router; 