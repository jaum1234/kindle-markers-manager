import { Readable } from "stream";
import RawClipping from "../raw_clipping/raw_clipping.service";
import MyClippingsFile from "./file.service";

describe("TestFile", () => {
    describe("parse()", () => {
        it("Should parse a MyClippings file", async () => {
            const f = [
                "Computer Networking: A Top-Down Approach, 7/e (James Kurose;Keith Ross)",
                "- Seu destaque na página 56 | posição 851-851 | Adicionado: segunda-feira, 21 de outubro de 2024 17:26:07",
                "            ",
                "Today’s Internet is arguably the largest engineered system",
                "==========",
            ];

            const s = ["﻿Nexus (Harari,Yuval Noah)",
                "- Seu destaque na página 66 | posição 1011-1013 | Adicionado: segunda-feira, 21 de outubro de 2024 17:32:25",
                "            ",
                "Stories were the first crucial information technology developed by humans. They laid the foundation for all large-scale human cooperation and made humans the most powerful animals on earth. But as an information technology, stories have their limitations.",
                "==========",
            ]
            
            const lines = f.concat(s).map(line => `${line}\r\n`);

            const file = new MyClippingsFile(Readable.from(lines));

            const parsed = await file.parse();
            
            f.pop();
            s.pop();

            expect(parsed.length).toBe(2);
            expect(parsed[0].toString()).toEqual((new RawClipping(f.join("\r\n").trim())).toString());
            expect(parsed[1].toString()).toEqual((new RawClipping(s.join("\r\n").trim())).toString());
        });
    });
});