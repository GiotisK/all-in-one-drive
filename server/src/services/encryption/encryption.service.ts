import crypto from 'crypto';
import * as crypt from 'crypto';

export const encrypt = (message: string) => {
	const iv = crypto.randomBytes(16);
	const key = process.env.AES256_KEY;
	const cipher = crypt.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(message, 'utf-8', 'hex');
	encrypted += cipher.final('hex');
	const cipherObj = { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
	return JSON.stringify(cipherObj);
};

export const decrypt = cipherObj => {
	cipherObj = JSON.parse(cipherObj);
	const key = process.env.AES256_KEY;
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(cipherObj.iv, 'hex'));
	let decrypted = decipher.update(Buffer.from(cipherObj.encryptedData, 'hex'), 'hex', 'utf-8');
	decrypted += decipher.final('utf-8');
	return decrypted;
};
