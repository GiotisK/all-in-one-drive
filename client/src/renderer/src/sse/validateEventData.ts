import { Validator } from './validators';

type ValidationResult<T> = { isValid: true; data: T } | { isValid: false };

export const validateEventData = <T>(
	eventData: string,
	validator: Validator<T>,
	silent = false
): ValidationResult<T> => {
	try {
		const parsedData = JSON.parse(eventData);
		if (validator(parsedData)) {
			return { isValid: true, data: parsedData };
		}
		if (!silent) {
			console.error(
				'Could not validate expected type for event-data:\n',
				JSON.stringify(parsedData, null, 2)
			);
		}
		return { isValid: false };
	} catch (err) {
		console.error(`Error parsing JSON data. Error: ${(err as Error).message}`);
		return { isValid: false };
	}
};
