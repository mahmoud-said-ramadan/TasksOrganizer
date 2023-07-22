
import dotenv from 'dotenv';
dotenv.config()


import express from 'express';
import bootstrap from './src/index.router.js';
const app = express();


bootstrap(app, express);
const port = 5000;
app.listen(port, () => {
    console.log(`Server Is Running On Port.............${port} `);
});