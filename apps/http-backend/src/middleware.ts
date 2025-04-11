import {Request,Response,NextFunction } from "express";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: string;
      userId?: string;
    }
  }
}
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";


export function middleware(req:Request, res:Response, next:NextFunction) {
  // Middleware logic here

  const token = req.headers["authorization"]??"";
  const decoded = jwt.verify(token, JWT_SECRET);

  if(decoded) {
    // User is authenticated
    req.user = decoded.userId;
    next();
  }else {
    // User is not authenticated
    return res.status(403).json({ message: "Unauthorized" });
  }
}