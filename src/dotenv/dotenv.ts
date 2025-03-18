import "dotenv/config";

const getEnvVar = (key: string): string | undefined => {
    return process.env[key];
}

const setEnvVar = (key: string, value: string): void => {
    process.env[key] = value;
}

export {
    getEnvVar,
    setEnvVar
};
