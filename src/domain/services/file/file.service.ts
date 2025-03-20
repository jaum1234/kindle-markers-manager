import RawClipping from "../raw_clipping/raw_clipping.service";

interface File {
    parse(): Promise<RawClipping[]>;
}

export default File;