import express from 'express';
import ClippingsController from './infra/controllers/clippings/clippings.controller';
import DotenvService from './infra/services/dotenv/dotenv.service';

const app = express();

const env = new DotenvService();

const port = env.get('PORT');

const clippingsController = new ClippingsController();

app.put("/import-clipings", clippingsController.importClippings);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});