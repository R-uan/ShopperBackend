export class MeasureNotFoundException extends Error {
	response: { error_code: string; error_description: string };
	constructor() {
		super();
		this.response = {
			error_code: "MEASURE_NOT_FOUND",
			error_description: "Não foi possivel achar a leitura",
		};
	}
}
