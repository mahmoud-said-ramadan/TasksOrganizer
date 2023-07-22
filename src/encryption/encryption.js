import CryptoJS from "crypto-js";
import bcrypt from 'bcryptjs'


export const decryptPhone = async (user) => {
    if (user && user.phone) {
        const bytes = CryptoJS.AES.decrypt(user.phone, process.env.ENCRYPT_PHONE_KEY);
        user.phone = bytes.toString(CryptoJS.enc.Utf8);
    }
    return user;
}

export const decrypt = async (elements) => {
    const decrypted = elements.map((ele) => {
        const decrypted = ele.toObject();
        if (decrypted.userId) {
            decryptPhone(decrypted.userId);
        }
        if (decrypted.assignTo) {
            decryptPhone(decrypted.assignTo);
        }
        return decrypted;
    });
    return await decrypted;
}

export const doHashing = (password) => {
    return bcrypt.hashSync(password, parseInt(process.env.SALT_LENGTH));
}