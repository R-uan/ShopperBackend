import fs from "fs";
import path from "path";
var isBase64 = require("is-base64");
import { IUploadRequestBody } from "../Interfaces/Requests/IUploadRequestBody";

export class ImageService {
	public static CreateTempFile(request: IUploadRequestBody) {
		console.log("CreateTempFile");

		const { customer_code, image, measure_datetime, measure_type } = request;

		const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
		const buffer = Buffer.from(base64Data, "base64");
		const fileName = `${customer_code}+${measure_type}`;
		const tempFilePath = path.join(__dirname, `${fileName}.png`);
		console.log("Before Writing File");
		fs.writeFileSync(tempFilePath, buffer);
		console.log("After Writing File");

		return tempFilePath;
	}

	public static DeleteTempFile(path: string) {
		fs.rmSync(path);
	}

	public static validateImage(data: string) {
		const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
		if (!base64Regex.test(data)) return false;
		const base64Data = data.replace(base64Regex, "");
		if (!isBase64(base64Data)) return false;
		try {
			return Buffer.from(base64Data, "base64").length > 0;
		} catch (error) {
			return false;
		}
	}
}
