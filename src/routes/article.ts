import * as express from "express";
import { Router } from "express";
import { auth } from "../middleware/auth";
import * as ArticleController from '../controllers/article';

const router: Router = express.Router();

router.post('/create', auth, ArticleController.createOneArticle);
router.get('/all', auth, ArticleController.getAllArticles);
router.get('/all/user', auth, ArticleController.getAllArticlesOneUser);
router.put('/update', auth, ArticleController.updateOneArticle);
router.delete('/delete', auth, ArticleController.deleteOneArticle);

export const articleRoutes = router;