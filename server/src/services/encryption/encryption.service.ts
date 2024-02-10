import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export interface EncryptedData {
	iv: string;
	encryptedText: string;
}

export class EncryptionService {
	async hashPassword(password: string) {
		const saltRounds = parseInt(process.env.SALT_ROUNDS!);
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		return hashedPassword;
	}

	async comparePasswordWithHash(password: string, hash: string) {
		return bcrypt.compare(password, hash);
	}

	generateJsonWebToken(email: string) {
		const secret = process.env.JWT_SECRET!;
		const payload = { email };
		const token = jwt.sign(payload, secret, {
			expiresIn: process.env.TOKEN_EXPIRATION!,
		});
		return token;
	}

	encrypt(text: string): string {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(
			'aes-256-cbc',
			Buffer.from(process.env.AES256_KEY!),
			iv
		);
		let encrypted = cipher.update(text, 'utf-8', 'hex');
		encrypted += cipher.final('hex');
		return JSON.stringify({ iv: iv.toString('hex'), encryptedText: encrypted });
	}

	decrypt(encrypted: EncryptedData): string {
		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			Buffer.from(process.env.AES256_KEY!),
			Buffer.from(encrypted.iv, 'hex')
		);
		let decrypted = decipher.update(encrypted.encryptedText, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		return decrypted;
	}

	getDecryptedTokenFromEncryptedTokenString(encryptedTokenStr: string) {
		const encryptedToken = JSON.parse(encryptedTokenStr) as EncryptedData;
		const token = this.decrypt(encryptedToken);
		return token;
	}
}

export default new EncryptionService();
