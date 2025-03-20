import RawClippingLine from "./raw_clipping_line.service";

describe("Unit tests for RawClippingLine", () => {
    it("Should extract the author name when between parentheses", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)";

        const raw = new RawClippingLine(input);

        const expected = "James Kurose;Keith Ross";
        const result = raw.extractAuthor();

        expect(result).toBe(expected);
    });

    it("Should extract the author name when after a dash", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross";

        const raw = new RawClippingLine(input);

        const expected = "James Kurose;Keith Ross";
        const result = raw.extractAuthor();

        expect(result).toBe(expected);
    });

    it("Should extract the book title when succeeded by parentheses", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)";
        const expected = "Computer Networking: A Top-Down Approach, 7/e";

        const raw = new RawClippingLine(input);
        const result = raw.extractBookTitle();

        expect(result).toBe(expected);
    });

    it("Should extract the book title when succeeded by a dash", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross";
        const expected = "Computer Networking: A Top-Down Approach, 7/e";

        const raw = new RawClippingLine(input);
        const result = raw.extractBookTitle();

        expect(result).toBe(expected);
    });

    it("Should extract the book title when no author is present", () => {
        const input = "Computer Networking: A Top-Down Approach, 7/e";
        const expected = "Computer Networking: A Top-Down Approach, 7/e";

        const raw = new RawClippingLine(input);
        const result = raw.extractBookTitle();

        expect(result).toBe(expected);
    });

    it("Should extract the page when the input is in portuguese", () => {
        const input = "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25";
        const expected = "66";

        const raw = new RawClippingLine(input);
        const result = raw.extractPage();

        expect(result).toBe(expected);
    });

    it("Should extract the page when the input is in english", () => {
        const input = "Your highlight on page 66 | location 1011-1013 | Added on Monday, October 21, 2024 5:32:25 PM";
        const expected = "66";

        const raw = new RawClippingLine(input);
        const result = raw.extractPage();

        expect(result).toBe(expected);
    });

    it("Should extract the position when the input is in portuguese", () => {
        const input = "Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25";
        const raw = new RawClippingLine(input);

        const expected = ["1011", "1013"];
        const result = raw.extractPositions();

        expect(result).toStrictEqual(expected);
    });

    it("Should extract the position when the input is in english", () => {
        const input = "Your highlight on page 66 | location 2-4 | Added on Monday, October 21, 2024 5:32:25 PM";
        const raw = new RawClippingLine(input);
        
        const expected = ["2", "4"];
        const result = raw.extractPositions();

        expect(result).toStrictEqual(expected);
    });
});