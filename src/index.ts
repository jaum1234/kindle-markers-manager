const { importClippings, renderPage } = require("./domain/clipping/import_clippings/controller/import_clippings.controller");
import app from "./server";
import Dotenv from './shared/dotenv.service';

app.get("/", renderPage());
app.put("/clippings/import-clipping", importClippings());

const port = Dotenv.get("APP_PORT");

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});