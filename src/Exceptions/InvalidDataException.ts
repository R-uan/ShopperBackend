export class InvalidDataException extends Error {
	response: { error_code: string; error_description: string[] };
	constructor(violations: string[]) {
		super();
		this.response = {
			error_code: "INVALID_DATA",
			error_description: violations,
		};
	}
}
