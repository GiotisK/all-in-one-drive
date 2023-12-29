import crypto from 'crypto';

export interface EncryptedData {
	iv: string;
	encryptedText: string;
}

export function encrypt(text: string): string {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.AES256_KEY!), iv);
	let encrypted = cipher.update(text, 'utf-8', 'hex');
	encrypted += cipher.final('hex');
	return JSON.stringify({ iv: iv.toString('hex'), encryptedText: encrypted });
}

export function decrypt(encrypted: EncryptedData): string {
	const decipher = crypto.createDecipheriv(
		'aes-256-cbc',
		Buffer.from(process.env.AES256_KEY!),
		Buffer.from(encrypted.iv, 'hex')
	);
	let decrypted = decipher.update(encrypted.encryptedText, 'hex', 'utf-8');
	decrypted += decipher.final('utf-8');
	return decrypted;
}
