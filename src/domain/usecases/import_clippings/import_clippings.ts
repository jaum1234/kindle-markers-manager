import Clipping from "../../entities/clipping.entity";
import File from "../../services/file/file.service";
import RawClipping from "../../services/raw_clipping/raw_clipping.service";

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
}

export default importClippings;