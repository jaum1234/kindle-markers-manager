import { Readable } from "stream";
import { File as IFile } from "../../types/file.type";
import RawClipping from "../raw_clipping/raw_clipping.service";

class File implements IFile {
    public constructor(
        private file: Readable
    ) {}

    public parse(): Promise<RawClipping[]> {
        return new Promise(r => {
            let parsed: string = "";;

            this.file.on("data", (data: any) => {
                parsed += data.toString("utf-8");
            });

            this.file.on("close", () => {
                r(parsed
                    .split("==========")
                    .filter((clipping: string) => clipping.trim() !== "")
                    .map((clipping: string) => new RawClipping(clipping.trim()))
                );
            });
        });
    }
}

export default File;