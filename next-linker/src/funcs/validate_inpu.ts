export const validate_email = (email: string) => {
    const regex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regex.test(email);
}
