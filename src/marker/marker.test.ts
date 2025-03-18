import { extractAuthor, extractBookTitle, extractPage, extractPositions } from "./marker";

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

    it("Should extract the page when the input is in portuguese", () => {
        const input = "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25";
        const expected = "66";
        const result = extractPage(input);

        expect(result).toBe(expected);
    });

    it("Should extract the page when the input is in english", () => {
        const input = "Your highlight on page 66 | location 1011-1013 | Added on Monday, October 21, 2024 5:32:25 PM";
        const expected = "66";
        const result = extractPage(input);

        expect(result).toBe(expected);
    });

    it("Should extract the position when the input is in portuguese", () => {
        const input = "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25";
        const expected = ["1011", "1013"];
        const result = extractPositions(input);

        expect(result).toStrictEqual(expected);
    });

    it("Should extract the position when the input is in english", () => {
        const input = "Your highlight on page 66 | location 2-4 | Added on Monday, October 21, 2024 5:32:25 PM";
        const expected = ["2", "4"];
        const result = extractPositions(input);

        expect(result).toStrictEqual(expected);
    });
});