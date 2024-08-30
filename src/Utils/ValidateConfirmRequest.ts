import { InvalidDataException } from "../Exceptions/InvalidDataException";
import IConfirmRequestBody from "../Interfaces/Requests/IConfirmRequestBody";

export default function ValidateConfirmRequest(body: IConfirmRequestBody) {
	let violations: string[] = [];
	const { confirmed_value, measure_uuid } = body;

	if (!measure_uuid) violations.push("Measure UUID not valid.");
	if (!confirmed_value) violations.push("Confirmed Value not valid.");
	else if (isNaN(confirmed_value)) violations.push("Confirmed Value needs to be a number.");

	if (violations.length > 0) throw new InvalidDataException(violations);

	return true;
}
