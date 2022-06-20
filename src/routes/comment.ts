import * as express from "express";
import { Router } from "express";
import { auth } from "../middleware/auth";
import * as CommentController from "../controllers/comment"

const router: Router = express.Router();

router.post('/articles/:id/comment', auth, CommentController.createOneComment);
router.get('/articles/:id/comments', auth, CommentController.getAllCommentsOneArticle);
router.get('/user/comments', auth, CommentController.getAllCommentsOneUser);
router.put('/comment', auth, CommentController.updateOneComment);
router.delete('/comment', auth, CommentController.deleteOneComment);

export const commentRoutes = router;
