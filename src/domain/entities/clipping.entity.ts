class Clipping {
    constructor(
        private type: string,
        private page: string,
        private startPosition: string,
        private endPosition: string,
        private content: string,
        private timestamp: string,
    ) { }
}

export default Clipping;