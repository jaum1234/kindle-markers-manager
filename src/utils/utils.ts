import { UNKNOWN } from "../constants";

const monthToNumber = (month: string, language: string = "en"): string => {
    let months: Array<string>;

    if (language === "en") {
        months = [
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        ];
    } else {
        months = [
            "janeiro", "fevereiro", "março", "abril", "maio", "junho",
            "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];
    }

    const numbers = [
        "01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"
    ];

    return months.reduce((obj, key, index) => {
        obj[key] = numbers[index];
        return obj;
    }, {} as { [key: string]: string })[month.toLowerCase()];
}

const matchOrUnkown = (text: string, pattern: RegExp): string => {
    const match = text.match(pattern);

    if (match !== null) {
        return match[0];
    }
    
    return UNKNOWN;
}

export {
    matchOrUnkown,
    monthToNumber
};
