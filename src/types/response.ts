export interface ResponseSingle<T> {
    data: T;
}
export interface ResponseError {
    detail: string;
    status?: number;
}
export type ResponseMultiple<T> = {
    data: T[];
    total: number;
};