import { UNKNOWN } from "../constants";
import { matchOrUnkown } from "./utils";

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
});