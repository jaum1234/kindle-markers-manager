import { UNKNOWN } from "../constants";
import { matchOrUnkown } from "../utils/utils";

const extractAuthor = (line: string): string => {
    const author = matchOrUnkown(line, /(?<=\().+(?=\))/);

    if (author !== UNKNOWN) {
        return author;
    }

    return matchOrUnkown(line, /(?<=- ).+/);
}