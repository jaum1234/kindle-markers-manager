export type RawClipping = {
    extractAuthor: () => string;
    extractType: () => string;
    extractPage: () => string;
    extractPositions: () => [string, string];
    extractContent: () => string;
    calculateTimestamp: () => number;
    extractBookTitle: () => string;
}