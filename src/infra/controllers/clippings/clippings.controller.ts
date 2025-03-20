import busboy from "busboy";
import { Request, Response } from "express";
import Clipping from "../../../domain/entities/clipping.entity";
import importClippings from "../../../domain/usecases/import_clippings/import_clippings";
import MyClippingsFile from "../../services/my_clippings_file/my_clippings_file.service";

class ClippingsController {
    public async importClippings(req: Request, res: Response): Promise<void> {
        
        const bb = busboy({ headers: req.headers });

        let clippings: Clipping[];

        bb.on("file", (name, file) => {
            console.log(`[${name}] found, starting import.`);
            importClippings(new MyClippingsFile(file)).then(c => clippings = c);
        });

        bb.on("close", () => {
            res.status(201).json({ data: clippings.map((c) => c.toDTO()) });
        });

        req.pipe(bb);
    }
}

export default ClippingsController;