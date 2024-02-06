export const isValidFileType = async (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/x-m4v'];

    return allowedTypes.includes(file.type);
}