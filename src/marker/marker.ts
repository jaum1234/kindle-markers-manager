import { UNKNOWN } from "../constants";
import { matchOrUnkown } from "../utils/utils";

const extractAuthor = (line: string): string => {
    const author = matchOrUnkown(line, /(?<=\().+(?=\))/);

    if (author !== UNKNOWN) {
        return author;
    }

    return matchOrUnkown(line, /(?<=- ).+/);
}

const extractBookTitle = (line: string): string => {
    const first = matchOrUnkown(line, /.+(?= \()/);

    if (first !== UNKNOWN) {
        return first;
    }

    const second = matchOrUnkown(line, /.+(?= -)/);

    if (second !== UNKNOWN) {
        return second;
    }

    return matchOrUnkown(line, /.+/);
}

const extractPage = (line: string): string => {
    return matchOrUnkown(line, /(?<=página |page )\d+(-\d+)?/);
}

const extractPositions = (line: string): Array<string> => {
    const position = matchOrUnkown(line, /(?<=posição|location) \d+(-\d+)?/);

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

export { extractAuthor, extractBookTitle, extractPage, extractPositions };
