import { Request, Response } from "express";
import { Article } from "../models/article"
import { User } from "../models/user";
import { ReqCustom } from '../types/ReqCustom'


type BodyReqCreate = {
        title: string;
        content: string;

}

type BodyReqUpdate = {
        newtitle: string;
        newcontent: string;
        idarticle: string;
}

type BodyReqDelete = {
        idarticle: string;
}



export async function createOneArticle(req: ReqCustom<BodyReqCreate>, res: Response) {
        await Article.create({
                UserModelId: req.userIdToken,
                title: req.body.title,
                content: req.body.content
        })
                .then(() => res.status(201).json({ message: "L'article a bien été publié." }))
                .catch(() => res.status(500).json({ message: 'error' }));

}

export async function getAllArticles(req: Request, res: Response) {
        const userInTheDB = await User.findByPk(req.userIdToken);
        if (userInTheDB instanceof User) {
                const ArticlesList = await Article.findAll({
                        attributes: ['UserModelId', 'id', 'title', 'content', 'createdAt'],
                        include: [{
                                model: User,
                                attributes: ['firstname', 'lastname'],
                                required: true
                        }],
                        order: [['createdAt', 'DESC']]
                })
                        .catch(() => {
                                return res.status(500).json({ error: 'error' });
                        });
                if (Array.isArray(ArticlesList)) {
                        return res.status(200).json(Object.assign({}, ArticlesList))

                }
        } else {
                return res.status(403).json({ message: 'not authorized' });
        }
}

export async function getAllArticlesOneUser(req: Request, res: Response) {
        const ArticlesList = await Article.findAll({
                where: { UserModelId: req.userIdToken },
                attributes: ['id', 'content', 'createdAt']
        }).catch(() => res.status(500).json({ message: 'error' }));
        if (Array.isArray(ArticlesList)) {
                return res.status(200).json(Object.assign({}, ArticlesList));
        }
}

export function updateOneArticle(req: ReqCustom<BodyReqUpdate>, res: Response) {
        if (req.isAdminToken === true) {
                Article.update({
                        title: req.body.newtitle,
                        content: req.body.newcontent
                },
                        {
                                where: {
                                        id: req.body.idarticle
                                }
                        })
                        //message sent : 0 article updated or 1 article updated 
                        .then(function (updateTab) {
                                if (updateTab[0] === 1) {
                                        return res.status(200).json({ message: "L'article est mis à jour." })
                                }
                                else return res.status(200).json({ message: String(updateTab[0]) + " article mis à jour." })
                        })

                        .catch(() => res.status(403).json({ error: 'error' }))


        } else {
                //if the user id is not the user id of the article creator, the article is not updated

                Article.update({
                        title: req.body.newtitle,
                        content: req.body.newcontent
                },
                        {
                                where: {
                                        UserModelId: req.userIdToken,
                                        id: req.body.idarticle
                                }
                        })
                        //message sent : 0 article updated or 1 article updated 
                        .then(function (updateTab) {
                                if (updateTab[0] === 1) {
                                        return res.status(200).json({ message: "L'article est mis à jour." })
                                }
                                else return res.status(200).json({ message: String(updateTab[0]) + " article mis à jour." })
                        })

                        .catch(() => res.status(403).json({ error: 'error' }))
        }
}

export async function deleteOneArticle(req: ReqCustom<BodyReqDelete>, res: Response) {
        if (req.isAdminToken === true) {
                await Article.destroy({
                        where: {
                                id: req.body.idarticle
                        }
                })
                        //message sent : 0 article deleted or 1 article deleted 
                        .then((nbRowdeleted) => res.status(200).json({ message: String(nbRowdeleted) + ' article supprimé.' }))
                        .catch(() => res.status(403).json({ error: 'error' }));
        } else {

                await Article.destroy({
                        where: {
                                UserModelId: req.userIdToken,
                                id: req.body.idarticle
                        }
                })
                        //message sent : 0 article deleted or 1 article deleted 
                        .then((nbRowdeleted) => res.status(200).json({ message: String(nbRowdeleted) + ' article supprimé.' }))
                        .catch(() => res.status(403).json({ error: 'error' }));
        }
}