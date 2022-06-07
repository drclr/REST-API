import * as express from "express";
import { Router } from "express";
import * as UserController from "../controllers/user";
import { auth } from "../middleware/auth";
import multer from "../middleware/mutler-config";

const router: Router = express.Router();

router.post('/join', UserController.join);
router.post('/login', UserController.login);
router.get('/login/refresh', auth, UserController.loginAfterRefresh);
router.get('/users', auth, UserController.getAllUsers);
router.put('/avatar', auth, multer, UserController.addOneAvatar);
router.put('/modifypassword', auth, UserController.modifyAccountPassword);
router.put('/modifylastname', auth, UserController.modifyAccountLastname);
router.delete('/deleteaccount', auth, UserController.deleteOneAccount);



export const userRoutes = router;