import fs from "fs";
import path from "path";
var isBase64 = require("is-base64");

export class ImageService {
	public static CreateImageFile(image: string) {
		const imagesPath = path.resolve(__dirname, "../../images/");
		const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
		const buffer = Buffer.from(base64Data, "base64");
		const fileName = `${new Date().getTime()}.png`;
		const filePath = path.join(imagesPath, fileName);
		fs.writeFileSync(filePath, buffer);
		return { filePath: filePath, fileName: fileName };
	}

	public static validateImage(data: string) {
		try {
			const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,/;
			if (!base64Regex.test(data)) return false;
			const base64Data = data.replace(base64Regex, "");
			if (!isBase64(base64Data)) return false;
			return Buffer.from(base64Data, "base64").length > 0;
		} catch (error) {
			return false;
		}
	}
}
