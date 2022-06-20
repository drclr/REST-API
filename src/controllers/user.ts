import { User } from '../models/user';
import * as bcrypt from "bcrypt";
import * as jwtoken from 'jsonwebtoken';
import { Request, Response } from "express";
import { config } from "../config";
import { ReqCustom } from '../types/ReqCustom';
import fs from 'fs';
import {
  ValidationError
} from 'sequelize/types';



type BodyReqJoin = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

type BodyReqLogin = {
  email: string;
  password: string;
}

type BodyReqModifyPassword = {
  password: string;
  newpassword: string;

}



interface ReqAddOneAvatar extends Express.Request {
  protocol: Request["protocol"],
  get: Request['get'];
  file?: Express.Multer.File
}


function checkPassword(pw: string): boolean {

  return (((pw.length >= 8) && (pw.length <= 15)) //between 8 and 15 characters
    //no special character
    && (!(/[^A-Za-z0-9]/.test(pw)))
    //at least one lower case
    && (/[a-z]/.test(pw))
    //at least one uppercase
    && (/[A-Z]/.test(pw))
    //at least one figure
    && (/[0-9]/.test(pw)))

}

function addAvatarInTheDB(req: ReqAddOneAvatar, res: Response) {
  const host = req.get('host');
  if ((host) && (req.file)) {
    const LinkSrc = `${req.protocol}://${host}/images/${req.file.filename}`
    User.update({ avatar: LinkSrc },
      { where: { id: req.userIdToken } })
      .then(() => res.status(201).json({ avatar: LinkSrc, message: 'avatar updated' }))
      .catch(() => res.status(403).json({ error: 'error' }));
  } else {
    return res.status(403).json({ message: "no file or host mentionned" })
  }
}

export async function addOneAvatar(req: ReqAddOneAvatar, res: Response) {
  const CurrentUser = await User.findOne({
    where: { id: req.userIdToken },
    attributes: ['avatar']
  });
  if (CurrentUser instanceof User) {
    if (CurrentUser.getDataValue('avatar') !== '') {
      fs.unlink('src/images/' + CurrentUser.getDataValue('avatar').split('images/')[1], function (err) {
        if (err) {
          res.status(500).json({ message: err.message });
        }
        else {
          addAvatarInTheDB(req, res);
        }
      });
    } else {
      addAvatarInTheDB(req, res);
    }
  }
}


export function join(req: ReqCustom<BodyReqJoin>, res: Response) {

  //if the password respects the conditions
  if (checkPassword(req.body.password)) {

    bcrypt.hash(req.body.password, 10)
      .then((pwHashed) => {
        User.create(
          {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: pwHashed,

          }
        )
          .then(() => { return res.status(200).json({ message: "user created" }) })
          .catch((err: ValidationError | Error) => {

            if ('errors' in err) {
              err.errors.forEach(function (e) {
                for (const [key, value] of Object.entries(e)) {
                  if (key == 'message') {
                    if (value === 'email must be unique') {
                      return res.status(403).json({ message: "L'adresse e-mail saisie est déjà utilisée." });

                    }
                  }
                }
              })
            } else {
              return res.status(500).json({ error: err.message });


            }
          }
          );


      })
      .catch(() => {
        return res.status(403).json({ error: 'error' });

      })

  } else {
    return res.status(403).json({
      message: "password not valid"
    });
  }

}

export function loginAfterRefresh(req: Request, res: Response) {

  User.findOne({ where: { id: req.userIdToken } })
    .then((CurrentUser) => {
      if (CurrentUser instanceof User) {
        return res.status(200).json({
          firstname: CurrentUser.firstname,
          lastname: CurrentUser.lastname,
          userId: req.userIdToken,
          avatar: CurrentUser.avatar,
          adresse: CurrentUser.email,
          IsAdmin: CurrentUser.IsAdmin
        })
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Error server' });
    });
}

export function login(req: ReqCustom<BodyReqLogin>, res: Response) {

  User.findOne({ where: { email: req.body.email } })
    .then((CurrentUser) => {
      if (CurrentUser instanceof User) {
        bcrypt.compare(req.body.password, CurrentUser.password)
          .then((same) => {
            if (same === true) {
              return res.status(200).json({
                firstname: CurrentUser.firstname,
                lastname: CurrentUser.lastname,
                userId: CurrentUser.id,
                avatar: CurrentUser.avatar,
                adresse: CurrentUser.email,
                IsAdmin: CurrentUser.IsAdmin,
                token: jwtoken.sign(

                  {
                    userId: CurrentUser.id,
                    IsAdmin: CurrentUser.IsAdmin,
                  },
                  config.KEY_token,
                  { expiresIn: '24h' }
                )
              });
            } else {
              return res.status(403).json({ message: 'Le mot de passe est incorrect.' });
            }
          })
          .catch(() => res.status(500).json({ message: " error server" }));
      }
      else {
        res.status(403).json({ message: "L'adresse e-mail indiquée ne correspond à aucun compte." });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Error server' });
    });

}

export async function getAllUsers(req: Request, res: Response) {
  const UserInTheDB = await User.findByPk(req.userIdToken);
  if (UserInTheDB instanceof User) {
    const UserList = await User.findAll({
      attributes: ['firstname', 'lastname']
    }).catch(() => {
      return res.status(500).json({ error: 'error' });
    });
    if (Array.isArray(UserList)) {

      const result = UserList.map((e) =>
        e.getDataValue('firstname') + ' ' + e.getDataValue('lastname')
      );
      return res.status(200).json(Object.assign({}, result));

    }
  } else {
    return res.status(403).json({ message: 'not authorized' });
  }
}

export function modifyAccountPassword(req: ReqCustom<BodyReqModifyPassword>, res: Response) {

  User.findOne({ where: { id: req.userIdToken } })
    .then((CurrentUser) => {
      if (CurrentUser instanceof User) {
        bcrypt.compare(req.body.password, CurrentUser.password)
          .then((same) => {
            if (same) {
              //if the password respects the conditions
              if (checkPassword(req.body.newpassword)) {
                bcrypt.hash(req.body.newpassword, 10)
                  .then((pwHashed) => {
                    User.update({ password: pwHashed },
                      { where: { id: req.userIdToken } })
                      .then(() => res.status(201).json({ message: 'Le mot de passe a bien été mis à jour.' }))
                      .catch(() => res.status(500).json({ error: 'error' }));

                  })
                  .catch(() => res.status(500).json({ error: 'error' }));
              }

            } else {
              res.status(403).json({ message: 'Le mot de passe initial est incorrect.' });
            }
          }

          )
          .catch(() => res.status(500).json({ error: 'error' }));

      } else {
        res.status(403).json({ message: "Acces non autorisé." });
      }

    })
    .catch(() => res.status(403).json({ error: 'error' }));
}

export function deleteOneAccount(req: Request, res: Response) {
  User.findOne({ where: { id: req.userIdToken } })
    .then((UserFound) => {
      if (UserFound) {
        User.destroy({ where: { id: req.userIdToken } })
          .then(() => res.status(201).json({ message: 'Account deleted' }))
          .catch(() => res.status(403).json({ error: 'error' }));
      } else {
        res.status(403).json({ message: 'user not found' });
      }
    })
    .catch(() => res.status(403).json({ error: 'not authorized' }))
}






