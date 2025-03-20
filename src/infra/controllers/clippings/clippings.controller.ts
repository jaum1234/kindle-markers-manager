import busboy from "busboy";
import { Request, Response } from "express";
import importClippings from "../../../domain/usecases/import_clippings/import_clippings";
import MyClippingsFile from "../../services/file/file.service";

class ClippingsController {
    public importClippings(req: Request, res: Response): void {
        
        const bb = busboy({ headers: req.headers });

        bb.on("file", (name, file, info) => {
            importClippings(new MyClippingsFile(file));
        });

        bb.on("close", () => {
            res.end();
        });

        req.pipe(bb);
    }
}

export default ClippingsController;