export const capitalizeFirstLetter = (text: string) => {
    if (!text) return text;

    const textWithoutFirstLetter = text.slice(1);
    const firstLetter = text[0].toUpperCase();
    const updatedText = firstLetter + textWithoutFirstLetter;

    return updatedText;
}