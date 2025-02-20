export function convertNumberToCustomLetters(number: string): string {
    const digitToLetter: { [key: string]: string } = {
        "0": "a",
        "1": "b",
        "2": "c",
        "3": "d",
        "4": "e",
        "5": "f",
        "6": "g",
        "7": "h",
        "8": "i",
        "9": "j"
    };

    return number.split("").map(digit => digitToLetter[digit] || "").join("");
}