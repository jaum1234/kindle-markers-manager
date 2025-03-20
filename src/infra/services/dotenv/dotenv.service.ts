import DotenvInterface from '../../../domain/services/dotenv/dotenv.service';

class DotenvService implements DotenvInterface {
    get(key: string): string | undefined {
        return process.env[key];
    }

    set(key: string, value: string): void {
        process.env[key] = value;
    }
}

export default DotenvService;