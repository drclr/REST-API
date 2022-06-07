import * as dotenv from 'dotenv';
dotenv.config();

type processEnv_type = {
        PORT: number | undefined,
        DB_host: string | undefined,
        DB_user: string | undefined,
        DB_user_pw: string | undefined,
        DB_name: string | undefined,
        KEY_token: string | undefined
}

type processEnv_type_required = {
        PORT: number,
        DB_host: string,
        DB_user: string,
        DB_user_pw: string,
        DB_name: string,
        KEY_token: string
}

function checkTypeOf_EnvVariables(processEnv: processEnv_type): processEnv_type_required {


        for (const [, value] of Object.entries(processEnv)) {
                if (typeof value === 'undefined') {
                        throw new Error('env file not correctly filled');
                }
        }
        return processEnv as processEnv_type_required;
}


const processEnv: processEnv_type = {
        PORT: (process.env.PORT != "") || (process.env.PORT != undefined) ? Number(process.env.PORT) : undefined,
        DB_host: process.env.DB_host,
        DB_user: process.env.DB_user,
        DB_user_pw: process.env.DB_user_pw,
        DB_name: process.env.DB_name,
        KEY_token: process.env.KEY_token
}

export const config = checkTypeOf_EnvVariables(processEnv);