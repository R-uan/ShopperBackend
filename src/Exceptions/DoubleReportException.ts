export class DoubleReportException extends Error {
	response: { error_code: string; error_description: string };
	constructor() {
		super();
		this.response = {
			error_code: "DOUBLE_REPORT",
			error_description: "Leitura do mês já realizada",
		};
	}
}
