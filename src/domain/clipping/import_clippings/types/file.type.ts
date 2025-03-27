import { RawClipping } from "./raw_clipping.type"

export type File = {
    parse: () => Promise<RawClipping[]>
} 