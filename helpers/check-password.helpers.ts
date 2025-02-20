import bcrypt from "bcrypt";
export async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10; // Độ phức tạp của thuật toán
    const hashedPassword : string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    const isMatch: boolean = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
