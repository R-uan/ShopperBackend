import { InvalidTypeException } from "../Exceptions/InvalidTypeException";

export default function ValidateListRequestQuery(query?: string) {
	if (query) {
		query = query.toUpperCase();
		if (query != "GAS" && query != "WATER") {
			throw new InvalidTypeException();
		}
	}

	return true;
}
