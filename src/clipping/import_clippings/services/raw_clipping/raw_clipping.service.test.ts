import RawClipping from "./raw_clipping.service";

describe("TestRawClipping", () => {

    it("Should extract the author name when between parentheses", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");;

        const raw = new RawClipping(input);

        const expected = "James Kurose;Keith Ross";
        const result = raw.extractAuthor();

        expect(result).toBe(expected);
    });

    it("Should extract the author name when after a dash", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");

        const raw = new RawClipping(input);

        const expected = "James Kurose;Keith Ross";
        const result = raw.extractAuthor();

        expect(result).toBe(expected);
    });

    it("Should extract the book title when succeeded by parentheses", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");
        const expected = "Computer Networking: A Top-Down Approach, 7/e";

        const raw = new RawClipping(input);
        const result = raw.extractBookTitle();

        expect(result).toBe(expected);
    });

    it("Should extract the book title when succeeded by a dash", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e - James Kurose;Keith Ross",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");
        const expected = "Computer Networking: A Top-Down Approach, 7/e";

        const raw = new RawClipping(input);
        const result = raw.extractBookTitle();

        expect(result).toBe(expected);
    });

    it("Should extract the book title when no author is present", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");        
        const expected = "Computer Networking: A Top-Down Approach, 7/e";

        const raw = new RawClipping(input);
        const result = raw.extractBookTitle();

        expect(result).toBe(expected);
    });

    it("Should extract the page when the input is in portuguese", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");       
        
        const expected = "56";

        const raw = new RawClipping(input);
        const result = raw.extractPage();

        expect(result).toBe(expected);
    });

    it("Should extract the page when the input is in english", () => {
        const input = "Your highlight on page 66 | location 1011-1013 | Added on Monday, October 21, 2024 5:32:25 PM";
        const expected = "66";

        const raw = new RawClipping(input);
        const result = raw.extractPage();

        expect(result).toBe(expected);
    });

    it("Should extract the position when the input is in portuguese", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");
        
        const raw = new RawClipping(input);

        const expected = ["851", "851"];
        const result = raw.extractPositions();

        expect(result).toStrictEqual(expected);
    });

    it("Should extract the position when the input is in english", () => {
        const input = "Your highlight on page 66 | location 2-4 | Added on Monday, October 21, 2024 5:32:25 PM";
        const raw = new RawClipping(input);
        
        const expected = ["2", "4"];
        const result = raw.extractPositions();

        expect(result).toStrictEqual(expected);
    });

    it("Should extract the type when the input is in portuguese", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");

        const raw = new RawClipping(input);

        const expected = "highlight";
        const result = raw.extractType();

        expect(result).toBe(expected);
    });

    it("Should extract the content", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\n");

        const raw = new RawClipping(input);

        const expected = "Today’s Internet is arguably the largest engineered system";
        const result = raw.extractContent();

        expect(result).toBe(expected);
    });

    it("Should calculate the timestamp when the input is in portuguese", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");

        const raw = new RawClipping(input);
        expect(raw.calculateTimestamp()).toBe(1729542745);
    });

    it("Should calculate the timestamp when the input is in english", () => {
        const input = [
            "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
            "- Your highlight on page 66 | location 1011-1013 | Added on Monday, October 21, 2024 5:32:25 PM",
            "            ",
            "Today’s Internet is arguably the largest engineered system",
        ].join("\r\n");

        const raw = new RawClipping(input);
        expect(raw.calculateTimestamp()).toBe(1729542745);
    });

});