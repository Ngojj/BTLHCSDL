import { Router } from "express";
import userController from "./user.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router()

// router.get('/', verifyToken as any, userController.getAllUsers)
// router.get('/:id', verifyToken as any, userController.getUserById as any)
// router.post('/create', verifyToken as any, userController.createNewUser)
// router.put('/update', verifyToken as any,userController.updateUser as any)
// router.delete('/delete/:id', verifyToken as any, userController.deleteUser as any)


export default router