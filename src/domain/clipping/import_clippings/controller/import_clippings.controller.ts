import busboy from "busboy";
import { Request, Response } from "express";
import { ROOT } from "../../../../constants";
import Clipping from "../../clipping.entity";
import importClippingsUsecase from "../import_clippings.usecase";
import File from "../services/file/file.service";

export const renderPage = () => {
    return (req: Request, res: Response) => {
        res.sendFile("public/index.html", { root: ROOT });
    };
}

export const importClippings = () => {
    return (req: Request, res: Response) => {
        const bb = busboy({ headers: req.headers });
    
        let clippings: Clipping[];
    
        bb.on("file", (name, file) => {
            console.log(`[${name}] found, starting import.`);
            importClippingsUsecase(new File(file)).then(c => clippings = c);
        });
    
        bb.on("close", () => {
            res.status(201).json({ data: clippings.map((c) => c.toDTO()) });
        });
    
        req.pipe(bb);
    }
} 

