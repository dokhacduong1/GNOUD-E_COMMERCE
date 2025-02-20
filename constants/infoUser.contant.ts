export const constantUser = function ({
    FullName,
    fullName,
    Email,
    email,
    Birthday,
    birthday,
    ID,
    id,
    Sex,
    sex,
    Avatar,
    avatar
}: {
    FullName?: string,
    fullName?: string,
    Email: string,
    email: string,
    Birthday: string,
    birthday: string,
    ID: number,
    id: number,
    Sex?: string,
    sex?: string
    Avatar?: string
    avatar?: string
}) {
    return {
        fullName: FullName || fullName,
        email: Email || email,
        birthday: Birthday || birthday,
        id: ID || id,
        sex: Sex || sex,
        avatar: Avatar || avatar
    };
};