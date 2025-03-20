interface RawClipping {
    extractAuthor(): string;
    extractBookTitle(): string;
    extractPage(): string;
    extractPositions(): [string, string];
    extractType(): string
    extractContent(): string
    calculateTimestamp(): number
}

export default RawClipping;