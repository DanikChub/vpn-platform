import axios from "axios";

import type {
    ApiError,
    ApiErrorResponse,
} from "./api.types";


const DEFAULT_ERROR_MESSAGE =
    "Произошла неизвестная ошибка";

const NETWORK_ERROR_MESSAGE =
    "Не удалось связаться с сервером";


export function normalizeApiError(
    error: unknown
): ApiError {
    if (!axios.isAxiosError(error)) {
        return {
            status: null,
            message:
                error instanceof Error
                    ? error.message
                    : DEFAULT_ERROR_MESSAGE,
        };
    }

    const status =
        error.response?.status ??
        null;

    const data =
        error.response?.data;

    const responseData =
        data as
            | ApiErrorResponse
            | undefined;

    const message =
        responseData?.message ??
        (
            error.response
                ? error.message
                : NETWORK_ERROR_MESSAGE
        );

    return {
        status,
        message,
        data,
    };
}