export default interface IMeasure {
	image_url: string;
	measure_uuid?: string;
	measure_type: string;
	customer_code: string;
	measure_datetime: Date;
	measure_value: number;
	has_confirmed: boolean;
}
