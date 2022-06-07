import { NextFunction, Response } from 'express';
import * as jwtoken from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';
import { config } from "../config";

//matched with jwtoken.sign payload
interface Token {
  userId: string,
  IsAdmin: boolean
}

interface ReqCustomAuth extends Express.Request {
  headers: IncomingHttpHeaders;

}

export function auth(req: ReqCustomAuth, res: Response, next: NextFunction) {

  if (req.headers.authorization != undefined) {
    const tken = req.headers.authorization.split(' ')[1];
    try {
      const tken_decoded = jwtoken.verify(tken, config.KEY_token) as Token;


      if ((tken_decoded instanceof Object) && ('userId' in tken_decoded)) {

        req.userIdToken = Number(tken_decoded.userId);
        req.isAdminToken = tken_decoded.IsAdmin;

        next();

      } else {
        return res.status(403).json({ message: 'wrong input' });
      }
    } catch (err) {
      return res.status(500).json({ error: err })
    }

  } else {
    return res.status(403).json({ message: 'wrong input' });
  }
}

