import { Request, Response } from "express";
import { GeminiService } from "../Services/GeminiService";
import { InvalidDataException } from "../Exceptions/InvalidDataException";
import { VaidateUploadRequest } from "../Utils/ValidateUploadRequest";
import { IUploadRequestBody } from "../Interfaces/Requests/IUploadRequestBody";
import Service from "./Services";
import { DoubleReportException } from "../Exceptions/DoubleReportException";
import IConfirmRequestBody from "../Interfaces/Requests/IConfirmRequestBody";
import ValidateConfirmRequest from "../Utils/ValidateConfirmRequest";
import { ConfirmationDuplicateException } from "../Exceptions/ConfirmationDuplicateException";
import { MeasureNotFoundException } from "../Exceptions/MeasureNotFoundException";

export default class Controller {
	// 100%
	public static async Upload(req: Request, res: Response) {
		try {
			const body = req.body as IUploadRequestBody;
			VaidateUploadRequest(body);
			const appUrl = `${req.protocol}://${req.hostname}/`;
			const value = await Service.Upload(body);
			res.status(200).json(value);
		} catch (error) {
			if (error instanceof InvalidDataException) res.status(400).json(error.response);
			else if (error instanceof DoubleReportException) res.status(409).json(error.response);
			else res.status(500).json(error);
		}
	}

	// 100%
	public static async Confirm(req: Request, res: Response) {
		try {
			const body: IConfirmRequestBody = req.body;
			ValidateConfirmRequest(body);
			const confirm = await Service.Confirm(body);
			if (confirm) return res.status(200).json({ success: true });
			else return res.status(500).json("An behaviour has occurred.");
		} catch (error) {
			if (error instanceof InvalidDataException) return res.status(400).json(error.response);
			if (error instanceof MeasureNotFoundException) return res.status(404).json(error.response);
			if (error instanceof ConfirmationDuplicateException) return res.status(409).json(error.response);
			else res.status(500).json(error);
		}
	}

	// 66%
	public static async CostumerList(req: Request, res: Response) {
		try {
			const costumerId = req.params.costumerId;
			const measures = await Service.GetCustomerMeasures(costumerId);
			if (measures == null) {
				res.status(404).json({
					error_code: "MEASURES_NOT_FOUND",
					error_description: "Nenhuma leitura encontrada",
				});
			}

			res.status(200).json(measures);
		} catch (error) {
			res.status(500);
		}
	}
}
