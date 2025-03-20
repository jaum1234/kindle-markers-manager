class Clipping {
    constructor(
        private type: string,
        private page: string,
        private startPosition: string,
        private endPosition: string,
        private content: string,
        private timestamp: number,
        private book: string,
        private author: string
    ) { }

    public toDTO() {
        return {
            type: this.type,
            page: this.page,
            startPosition: this.startPosition,
            endPosition: this.endPosition,
            content: this.content,
            timestamp: this.timestamp,
            book: this.book,
            author: this.author
        }
    }
}

export default Clipping;