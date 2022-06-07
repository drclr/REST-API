import { Request, Response } from "express";
import { Article } from "../models/article";
import { Comment } from "../models/comment";
import { User } from "../models/user";
import { ReqCustomParams } from '../types/ReqCustom';
import { ReqCustom } from '../types/ReqCustom';

//matched with frontend req
type BodyReqCreateComment = {
  content: string;
}

type BodyReqUpdateOneComment = {
  newcontent: string;
  idComment: string;

}
type BodyReqDeleteOneComment = {
  idComment: number;
}


export async function createOneComment(req: ReqCustomParams<BodyReqCreateComment>, res: Response) {

  const ArticleInTheDB = await Article.findByPk(req.params.id);
  const UserInTheDB = await User.findByPk(req.userIdToken);
  if ((ArticleInTheDB instanceof Article) && (UserInTheDB instanceof User)) {
    await Comment.create({
      UserModelId: req.userIdToken,
      ArticleModelId: req.params.id,
      content: req.body.content
    })
      .then((Res) => res.status(201).json(Res))
      .catch(() => res.status(500).json({ error: 'error' }));
  } else {
    return res.status(403).json({ message: "Action non autorisée: article et/ou utilisateur introuvable" })
  }
}

export async function getAllCommentsOneArticle(req: ReqCustomParams<BodyReqCreateComment>, res: Response) {
  const UserInTheDB = await User.findByPk(req.userIdToken);
  if (UserInTheDB instanceof User) {
    const CommentsList = await Comment.findAll({
      where: { ArticleModelId: req.params.id },
      attributes: ['id', 'UserModelId', 'content', 'createdAt'],
      include: [{
        model: User,
        attributes: ['firstname', 'lastname'],
        required: true
      }],
      order: [['createdAt', 'DESC']]
    }).catch(() => res.status(500).json({ message: 'error' }));

    if (Array.isArray(CommentsList)) {
      return res.status(200).json(Object.assign({}, CommentsList));
    }

  } else return res.status(403).json({ message: 'non autorisé' });
}

export async function getAllCommentsOneUser(req: Request, res: Response) {
  const CommentsList = await Comment.findAll({
    where: { UserModelId: req.userIdToken },
    attributes: ['content', 'createdAt', 'ArticleModelId', 'id']
  }).catch(() => res.status(500).json({ message: 'error' }));
  if (Array.isArray(CommentsList)) {
    return res.status(200).json(Object.assign({}, CommentsList));
  }
}

export function updateOneComment(req: ReqCustom<BodyReqUpdateOneComment>, res: Response) {
  if (req.isAdminToken === true) {
    Comment.update({
      content: req.body.newcontent
    },
      {
        where: {
          id: req.body.idComment
        }
      })
      //message sent : 0 comment updated or 1 comment updated 
      .then((updateTab) => res.status(200).json({ message: String(updateTab[0]) + " commentaire mis à jour." }))
      .catch(() => res.status(403).json({ error: 'error' }));


  } else {
    Comment.update({
      content: req.body.newcontent
    },
      {
        where: {
          UserModelId: req.userIdToken,
          id: req.body.idComment
        }
      })
      //message sent : 0 comment updated or 1 comment updated 
      .then((updateTab) => res.status(200).json({ message: String(updateTab[0]) + " commentaire mis à jour." }))
      .catch(() => res.status(403).json({ error: 'error' }));
  }
}

export async function deleteOneComment(req: ReqCustom<BodyReqDeleteOneComment>, res: Response) {
  if (req.isAdminToken === true) {
    await Comment.destroy({
      where: {
        id: req.body.idComment
      }
    })
      //message sent : 0 comment deleted or 1 comment deleted
      .then((nbRowdeleted) => res.status(200).json({ message: String(nbRowdeleted) + ' commentaire supprimé.' }))
      .catch(() => res.status(403).json({ error: 'error' }));

  } else {
    await Comment.destroy({
      where: {
        UserModelId: req.userIdToken,
        id: req.body.idComment
      }
    })
      //message sent : 0 comment deleted or 1 comment deleted
      .then((nbRowdeleted) => res.status(200).json({ message: String(nbRowdeleted) + ' commentaire supprimé.' }))
      .catch(() => res.status(403).json({ error: 'error' }));
  }
}








