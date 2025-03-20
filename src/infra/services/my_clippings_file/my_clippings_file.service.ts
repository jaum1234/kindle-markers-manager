import File from "../../../domain/services/file/file.service";

class MyClippingsFile implements File {
    public constructor(
        private file: any
    ) {}

    public parse(): string[] {
        this.file.on("data", (data: any) => {
            
        });

        return [""];
    }
}

export default MyClippingsFile;