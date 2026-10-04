export interface ApiErrorResponse {
    message?: string;
}

export interface ApiError {
    status: number | null;
    message: string;
    data?: unknown;
}