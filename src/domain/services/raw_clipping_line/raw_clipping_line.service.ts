interface RawClippingLine {
    extractAuthor(): string;
    extractBookTitle(): string;
    extractPage(): string;
    extractPositions(): [string, string];
}

export default RawClippingLine;