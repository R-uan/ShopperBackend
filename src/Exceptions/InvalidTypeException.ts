export class InvalidTypeException extends Error {
	response: { error_code: string; error_description: string };
	constructor() {
		super();
		this.response = {
			error_code: "INVALID_TYPE",
			error_description: "Tipo de medição não permitida",
		};
	}
}
