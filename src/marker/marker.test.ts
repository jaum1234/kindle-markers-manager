import { extractAuthor } from "./marker";

describe("Unit tests for Marker", () => {
    it("Should extract the author name when between parentheses", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)";
        const expected = "James Kurose;Keith Ross";
        const result = extractAuthor(input);

        expect(result).toBe(expected);
    });

    it("Should extract the author name when after a dash", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross";
        const expected = "James Kurose;Keith Ross";
        const result = extractAuthor(input);

        expect(result).toBe(expected);
    });
});