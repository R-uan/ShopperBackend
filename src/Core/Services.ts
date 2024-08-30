import { ConfirmationDuplicateException } from "../Exceptions/ConfirmationDuplicateException";
import { DoubleReportException } from "../Exceptions/DoubleReportException";
import { MeasureNotFoundException } from "../Exceptions/MeasureNotFoundException";
import IMeasure from "../Interfaces/IMeasure";
import IConfirmRequestBody from "../Interfaces/Requests/IConfirmRequestBody";
import { IUploadRequestBody } from "../Interfaces/Requests/IUploadRequestBody";
import { GeminiService } from "../Services/GeminiService";
import { ImageService } from "../Services/ImageService";
import Repository from "./Repository";

export default class Service {
	public static async Upload(body: IUploadRequestBody) {
		const { customer_code, image, measure_datetime, measure_type } = body;
		if (await Repository.CheckMonthMeasure(customer_code, measure_type, measure_datetime)) {
			throw new DoubleReportException();
		}

		const { fileName, filePath } = ImageService.CreateImageFile(image);
		const value = await GeminiService.ExtractValue(filePath);
		if (!value) throw new Error("Gemini could not read the value");
		const imageUrl = `http://localhost:3000/images/${fileName}`;

		const measure: IMeasure = {
			image_url: imageUrl,
			measure_value: value,
			has_confirmed: false,
			measure_datetime: new Date(body.measure_datetime),
			measure_type: body.measure_type,
			customer_code: body.customer_code,
		};

		const save: IMeasure = await Repository.StoreMeasure(measure);

		return {
			image_url: save.image_url,
			measure_value: value,
			measure_uuid: save.measure_uuid,
		};
	}

	public static async Confirm(body: IConfirmRequestBody) {
		const { confirmed_value, measure_uuid } = body;
		const check = await Repository.CheckIfConfirmed(measure_uuid);

		if (check == null) throw new MeasureNotFoundException();
		if (check) throw new ConfirmationDuplicateException();

		const confirm = await Repository.ConfirmMeasureValue(measure_uuid, confirmed_value);
		if (confirm) return true;
		else throw new Error("Could not update the report. But it's there.");
	}

	public static async GetCustomerMeasures(cusomer_code: string, query?: string) {
		const list = await Repository.GetCustomerMeasurements(cusomer_code, query);
		if (list.length == 0) return null;

		return {
			cusomer_code,
			measures: list,
		};
	}
}
