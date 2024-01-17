export interface IResponse {
    statusCode: number;
    message: string;
    data?: any;
    error?: string;
}