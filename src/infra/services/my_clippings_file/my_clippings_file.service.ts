import { Readable } from "stream";
import File from "../../../domain/services/file/file.service";
import RawClipping from "../raw_clipping/raw_clipping.service";

class MyClippingsFile implements File {
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

export default MyClippingsFile;