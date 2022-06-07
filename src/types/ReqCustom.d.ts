export interface ReqCustom<B> extends Express.Request {
        body: B;
}


export interface ReqCustomParams<B> extends Express.Request {
        body: B;
        params: { id: number }
}
