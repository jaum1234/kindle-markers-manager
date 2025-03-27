import { UNKNOWN } from "../../../../../constants";
import { RawClipping as IRawClipping } from "../../types/raw_clipping.type";
import { matchOrUnkown, monthToNumber } from "../../utils/import_clippings.utils";

class RawClipping implements IRawClipping {
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

    public extractType(): string {
        return matchOrUnkown(this.line, /destaque|highlight/) ? "highlight" : "note";
    }

    public extractContent(): string {
        return this.line.split(/\r?\n/)[3]?.trim();
    }

    public calculateTimestamp = (): number => {
        const parts = this.line.split(/\r?\n/)[1].trim().split("|");

        if (parts.length === 2) {
            return this.calculateTimestampFromPart(parts[1]);
        }
        
        return this.calculateTimestampFromPart(parts[2]);
    }

    private calculateTimestampFromPart = (part: string): number => {
        const dateParts = part.split(",");

        const isEnglishInput = dateParts.length === 3; 

        let day: string;
        let month: string;
        let year: string;
        let hour: string;
        let format: string;

        if (!isEnglishInput) {
            const date = dateParts[1].trim().split(" de "); 

            day = date[0].padStart(2, "0");
            month = monthToNumber(date[1], "pt").padStart(2, "0");
            year = date[2].trim().split(" ")[0];
            hour = date[2].trim().split(" ")[1];

            format = `${year}-${month}-${day} ${hour}`;
        } else {
            day = dateParts[1].trim().split(" ")[1].padStart(2, "0");;
            month = monthToNumber(dateParts[1].trim().split(" ")[0], "en").padStart(2, "0");
            year = dateParts[2].trim().split(" ")[0];
            hour = dateParts[2].trim().split(" ")[1] + " " + dateParts[2].trim().split(" ")[2];

            format = `${month}/${day}/${year} ${hour}`;
        }

        const date = new Date(format);
        
        return Math.floor(date.getTime()/1000);
    }

    public toString = (): string => {
        return this.line;
    }
}

export default RawClipping;