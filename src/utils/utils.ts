import { UNKNOWN } from "../constants";

const matchOrUnkown = (text: string, pattern: RegExp): string => {
    const match = text.match(pattern);

    if (match !== null) {
        return match[0];
    }
    
    return UNKNOWN;
}

export {
    matchOrUnkown
};
