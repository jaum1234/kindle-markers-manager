import express from 'express';
import { getEnvVar } from './dotenv/dotenv';

const app = express();

const port = getEnvVar("APP_PORT");

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});