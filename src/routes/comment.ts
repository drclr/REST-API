import * as express from "express";
import { Router } from "express";
import { auth } from "../middleware/auth";
import * as CommentController from "../controllers/comment"

const router: Router = express.Router();

router.post('/create/article/:id', auth, CommentController.createOneComment);
router.get('/all/article/:id', auth, CommentController.getAllCommentsOneArticle);
router.get('/all/user', auth, CommentController.getAllCommentsOneUser);
router.put('/update', auth, CommentController.updateOneComment);
router.delete('/delete', auth, CommentController.deleteOneComment);

export const commentRoutes = router;
