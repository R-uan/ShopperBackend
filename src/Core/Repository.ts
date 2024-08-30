import { PrismaClient } from "@prisma/client";
import IMeasure from "../Interfaces/IMeasure";

const dbContext = new PrismaClient();

export default class Repository {
	public static async GetCustomerMeasurements(customerCode: string, query?: string) {
		if (query) {
			query = query.toUpperCase();
			return await dbContext.measures.findMany({
				where: { customer_code: customerCode, measure_type: query },
				select: {
					measure_uuid: true,
					measure_datetime: true,
					measure_type: true,
					has_confirmed: true,
					image_url: true,
				},
			});
		}

		return await dbContext.measures.findMany({
			where: { customer_code: customerCode },
			select: {
				measure_uuid: true,
				measure_datetime: true,
				measure_type: true,
				has_confirmed: true,
				image_url: true,
			},
		});
	}

	public static async CreateCustomer(customer_code: string) {
		await dbContext.customers.create({ data: { customer_code: customer_code } });
	}

	public static async FindCustomer(customer_code: string) {
		return await dbContext.customers.findFirst({ where: { customer_code: customer_code } });
	}

	public static async CheckMonthMeasure(customer_code: string, measure_type: string, measure_datetime: Date) {
		const now = new Date(measure_datetime);
		const nowYear = now.getFullYear();
		const nowMonth = now.getMonth() + 1;
		const formattedMonth = String(nowMonth).padStart(2, "0");
		const startDate = new Date(`${nowYear}-${formattedMonth}-01T00:00:00.000Z`);

		const endDate = new Date(`${nowMonth < 12 ? `${nowYear}-${String(nowMonth + 1).padStart(2, "0")}` : `${nowYear + 1}-${1}`}-01T00:00:00.000Z`);

		return await dbContext.measures.findFirst({
			where: {
				customer_code: customer_code,
				measure_type: measure_type.toUpperCase(),
				measure_datetime: { gte: startDate, lt: endDate },
			},
		});
	}

	public static async CheckIfConfirmed(measure_uuid: string) {
		const measure = await dbContext.measures.findFirst({ where: { measure_uuid: measure_uuid } });
		return measure ? measure.has_confirmed : null;
	}

	public static async ConfirmMeasureValue(measure_uuid: string, measure_value: number) {
		const update = await dbContext.measures.update({
			where: { measure_uuid: measure_uuid },
			data: { measure_value: measure_value, has_confirmed: true },
		});

		return update.measure_value == measure_value && update.has_confirmed == true;
	}
	public static async StoreMeasure(measure: IMeasure) {
		const { has_confirmed, image_url, measure_datetime, measure_type, customer_code, measure_value } = measure;
		return await dbContext.$transaction(async (prisma: any) => {
			if (!(await this.FindCustomer(customer_code))) {
				await this.CreateCustomer(customer_code);
			}

			return await prisma.measures.create({
				data: {
					image_url: image_url,
					measure_value: measure_value,
					measure_type: measure_type.toUpperCase(),
					customer_code: customer_code,
					has_confirmed: has_confirmed,
					measure_datetime: measure_datetime,
				},
			});
		});
	}
}
