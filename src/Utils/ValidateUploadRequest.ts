import { ImageService } from "../Services/ImageService";
import { InvalidDataException } from "../Exceptions/InvalidDataException";
import { IUploadRequestBody } from "../Interfaces/Requests/IUploadRequestBody";

export function VaidateUploadRequest(body: IUploadRequestBody) {
	const { customer_code, image, measure_datetime, measure_type } = body;
	let violations: string[] = [];

	if (!image) {
		violations.push("Image was not provided. Please provide an image in the base64 format");
	}

	if (!ImageService.validateImage(image)) {
		violations.push("Could not validate image as base64");
	}

	if (!measure_type) {
		violations.push("Measure Type was not provided.");
	} else if (measure_type.toUpperCase() != "GAS" && measure_type.toUpperCase() != "WATER") {
		violations.push('Measure Type should be either "GAS" or "WATER"');
	}

	if (!customer_code) {
		violations.push("Costumer Code was not provided");
	}

	if (!measure_datetime) {
		violations.push("Measure DateTime was not provided");
	} else if (isNaN(new Date(measure_datetime).getTime())) {
		violations.push("Measure DateTime is not a valid date");
	}

	if (violations.length > 0) {
		throw new InvalidDataException(violations);
	}

	return true;
}
