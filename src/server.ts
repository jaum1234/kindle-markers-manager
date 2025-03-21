import express from 'express';

express.static("src/public");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/static"));

export default app;