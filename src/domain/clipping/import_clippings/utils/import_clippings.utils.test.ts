import { UNKNOWN } from "../../../../constants";
import { matchOrUnkown, monthToNumber } from "./import_clippings.utils";


describe("Unit tests for utils", () => {
    it("Should match the pattern", () => {
        const text = "Hello World";
        const pattern = /Hello/;

        const result = matchOrUnkown(text, pattern);
        expect(result).toBe("Hello");
    });

    it("Should return UNKNOWN when the pattern does not match", () => {
        const text = "Hello World";
        const pattern = /Goodbye/;

        const result = matchOrUnkown(text, pattern);
        expect(result).toBe(UNKNOWN);
    });

    it("Should convert portuguese month to number", () => {
        const month = "janeiro";
        const result = monthToNumber(month, "pt");
        expect(result).toBe("01");
    });

    it("Should convert english month to number", () => {
        const month = "january";
        const result = monthToNumber(month);
        expect(result).toBe("01");
    });

    it("Should return UNKNOWN when the month is not found", () => {
        const month = "not-a-month";
        const result = monthToNumber(month);
        expect(result).toBe(UNKNOWN);
    });
});