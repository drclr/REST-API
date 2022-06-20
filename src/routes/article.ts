import * as express from "express";
import { Router } from "express";
import { auth } from "../middleware/auth";
import * as ArticleController from '../controllers/article';

const router: Router = express.Router();

router.post('/article', auth, ArticleController.createOneArticle);
router.get('/articles', auth, ArticleController.getAllArticles);
router.put('/article', auth, ArticleController.updateOneArticle);
router.delete('/article', auth, ArticleController.deleteOneArticle);

export const articleRoutes = router;