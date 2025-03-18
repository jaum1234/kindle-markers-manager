import { extractAuthor, extractBookTitle } from "./marker";

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

    it("Should extract the book title when succeeded by parentheses", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)";
        const expected = "Computer Networking: A Top-Down Approach, 7/e";
        const result = extractBookTitle(input);

        expect(result).toBe(expected);
    });

    it("Should extract the book title when succeeded by a dash", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross";
        const expected = "Computer Networking: A Top-Down Approach, 7/e";
        const result = extractBookTitle(input);

        expect(result).toBe(expected);
    });

    it("Should extract the book title when no author is present", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e";
        const expected = "Computer Networking: A Top-Down Approach, 7/e";
        const result = extractBookTitle(input);

        expect(result).toBe(expected);
    });
});