import * as dotenv from 'dotenv';
dotenv.config();
import * as http from 'http';
import application from "./app";
import { config } from "./config";


application.set('port', config.PORT);
const server = http.createServer(application);
server.listen(config.PORT, () => console.log('Server connected on port '
        + config.PORT.toString()));
