interface Dotenv {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
}

export default Dotenv;