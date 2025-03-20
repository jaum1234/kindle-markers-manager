import RawClippingLineInterface from "../../../domain/services/raw_clipping_line/raw_clipping_line.service";
import { matchOrUnkown } from "../../../infra/utils/utils";
import { UNKNOWN } from "../../constants";

class RawClippingLine implements RawClippingLineInterface {
    public constructor(
        private line: string
    ) {}

    public extractAuthor = (): string => {
        const author = matchOrUnkown(this.line, /(?<=\().+(?=\))/);
    
        if (author !== UNKNOWN) {
            return author;
        }
    
        return matchOrUnkown(this.line, /(?<=- ).+/);
    }
    
    public extractBookTitle = (): string => {
        const first = matchOrUnkown(this.line, /.+(?= \()/);
    
        if (first !== UNKNOWN) {
            return first;
        }
    
        const second = matchOrUnkown(this.line, /.+(?= -)/);
    
        if (second !== UNKNOWN) {
            return second;
        }
    
        return matchOrUnkown(this.line, /.+/);
    }
    
    public extractPage = (): string => {
        return matchOrUnkown(this.line, /(?<=página |page )\d+(-\d+)?/);
    }
    
    public extractPositions = (): [string, string] => {
        const position = matchOrUnkown(this.line, /(?<=posição|location) \d+(-\d+)?/);
    
        if (position === null) {
            return [UNKNOWN, UNKNOWN];
        }
    
        const split = position.split("-");
    
        const start = split[0].trim();
        let end: string;
    
        if (split.length === 1) {
            end = start;
        } else {
            end = split[1].trim();
        }
    
        return [start, end];
    }
}

export default RawClippingLine;