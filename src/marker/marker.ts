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

export { extractAuthor, extractBookTitle, extractPage };
