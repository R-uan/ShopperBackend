import Service from "./Services";
import { Request, Response } from "express";
import ValidateConfirmRequest from "../Utils/ValidateConfirmRequest";
import { VaidateUploadRequest } from "../Utils/ValidateUploadRequest";
import ValidateListRequestQuery from "../Utils/ValidateListRequestQuery";
import { InvalidDataException } from "../Exceptions/InvalidDataException";
import { InvalidTypeException } from "../Exceptions/InvalidTypeException";
import { DoubleReportException } from "../Exceptions/DoubleReportException";
import IConfirmRequestBody from "../Interfaces/Requests/IConfirmRequestBody";
import { IUploadRequestBody } from "../Interfaces/Requests/IUploadRequestBody";
import { MeasureNotFoundException } from "../Exceptions/MeasureNotFoundException";
import { ConfirmationDuplicateException } from "../Exceptions/ConfirmationDuplicateException";

export default class Controller {
	public static async Upload(req: Request, res: Response) {
		try {
			const body = req.body as IUploadRequestBody;
			VaidateUploadRequest(body);

			const upload = await Service.Upload(body);

			return res.status(200).json(upload);
		} catch (error) {
			if (error instanceof InvalidDataException) return res.status(400).json(error.response);
			else if (error instanceof DoubleReportException) return res.status(409).json(error.response);
			else return res.status(500).json(error);
		}
	}

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

	public static async CostumerList(req: Request, res: Response) {
		try {
			const { measure_type } = req.query;
			ValidateListRequestQuery(measure_type as string);

			const costumerId = req.params.costumerId;

			const list = await Service.GetCustomerMeasures(costumerId, measure_type as string);

			if (list == null) {
				return res.status(404).json({
					error_code: "MEASURES_NOT_FOUND",
					error_description: "Nenhuma leitura encontrada",
				});
			}

			return res.status(200).json(list);
		} catch (error) {
			if (error instanceof InvalidTypeException) res.status(400).json(error.response);
			else return res.status(500);
		}
	}
}
