export class ConfirmationDuplicateException extends Error {
	response: { error_code: string; error_description: string };
	constructor() {
		super();
		this.response = {
			error_code: "CONFIRMATION_DUPLICATE",
			error_description: "Confirmação já realizada",
		};
	}
}
