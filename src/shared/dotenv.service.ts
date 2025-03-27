const Dotenv = {
    get(key: string) {
        return process.env[key];
    },
    set(key: string, value: string) {
        process.env[key] = value;
    }
}

export default Dotenv;
