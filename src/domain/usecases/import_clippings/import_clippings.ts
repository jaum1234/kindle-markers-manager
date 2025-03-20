import File from "../../services/file/file.service";

const importClippings = async (file: File): Promise<void> => {
    file.parse();
}

export default importClippings;