import dotnet from "dotenv";
import { ImageService } from "./ImageService";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IUploadRequestBody } from "../Interfaces/Requests/IUploadRequestBody";
import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";
dotnet.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("GEMINI_API_KEY was not found.");
const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiService {
	public static async ExtractValue(upload: IUploadRequestBody) {
		console.log("ExtractValue");
		const uploadResponse = await this.UploadImage(upload);
		const imageContent = await this.GenerateContent(uploadResponse);
		return { image_url: uploadResponse.file.uri, value: imageContent };
	}

	public static async UploadImage(upload: IUploadRequestBody) {
		console.log("UploadImage");
		const filePath = ImageService.CreateTempFile(upload);
		const uploadResponse = await fileManager.uploadFile(filePath, {
			mimeType: "image/png",
			displayName: `${filePath.split(".")[0]}`,
		});

		ImageService.DeleteTempFile(filePath);
		return uploadResponse;
	}

	public static async GenerateContent(uploadResponse: UploadFileResponse) {
		console.log("GenerateContent");
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const result = await model.generateContent([
			{
				fileData: {
					mimeType: uploadResponse.file.mimeType,
					fileUri: uploadResponse.file.uri,
				},
			},
			{ text: "Extract the usage value from this meter and return only the numeric value." },
		]);

		return parseInt(result.response.text());
	}
}
