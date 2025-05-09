import ClippingsController from "./infra/controllers/clippings/clippings.controller";
import app from "./server";

const main = ({
    controllers: {
        clippingsController,
    },
    port
}: {
    controllers: {
        clippingsController: ClippingsController,
    }
    port: string
}) => {
    app.put("/import-clippings", clippingsController.importClippings);

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

export default main;