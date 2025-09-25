import jwt from "jsonwebtoken";
import User from "../models/userModel.js";  
import asyncHandler from "./asyncHandler.js";

//middleware to authenticate user 

const authenticate = asyncHandler(async (req, res, next) => {
  let token ;

  //read jwt from jwt cookie
   token =  req.cookies.jwt;

   if(token){
    try {
      const decoded = jwt.verify(token , process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    }catch (error) {
      res.status(401).json({ message: "Unauthorized, token failed" });
    }
   }else{
    res.status(401).json({ message: "Unauthorized, no token" });
   }
});

//middleware to authorize admin user

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, not an admin" });
  }
}

export { authenticate, authorizeAdmin };