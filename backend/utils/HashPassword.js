import bcrypt from "bcrypt"

export const hashedPassword = async (password) =>{
    const hash = bcrypt.hash(password, 10)
    return hash;
}