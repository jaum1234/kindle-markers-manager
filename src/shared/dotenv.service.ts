class Dotenv {
    public get(key: string) {
        return process.env[key];
    }

    public set(key: string, value: string) {
        process.env[key] = value;
    }
}

export default Dotenv;