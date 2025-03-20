import ClippingsController from './infra/controllers/clippings/clippings.controller';
import DotenvService from './infra/services/dotenv/dotenv.service';
import main from './main';

const env = new DotenvService();

const clippingsController = new ClippingsController();

main({
    controllers: {
        clippingsController,
    },
    port: env.get('APP_PORT') as string
});