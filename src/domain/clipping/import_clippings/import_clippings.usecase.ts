import Clipping from "../clipping.entity";
import { File } from "./types/file.type";
import { RawClipping } from "./types/raw_clipping.type";

const importClippings = async (file: File): Promise<Clipping[]> => {
    const parsed = await file.parse();

    return parsed.map((r: RawClipping) => {
        const [start, end] = r.extractPositions();

        return new Clipping(
            r.extractType(),
            r.extractPage(),
            start,
            end,
            r.extractContent(),
            r.calculateTimestamp(),
            r.extractBookTitle(),
            r.extractAuthor()
        )
    });
};

export default importClippings;