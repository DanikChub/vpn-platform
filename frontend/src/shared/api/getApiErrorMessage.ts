import type {
    ApiError,
} from "./api.types";


const DEFAULT_ERROR_MESSAGE =
    "Произошла неизвестная ошибка";


export function isApiError(
    error: unknown
): error is ApiError {
    if (
        typeof error !== "object" ||
        error === null
    ) {
        return false;
    }

    const candidate =
        error as Partial<ApiError>;

    return (
        (
            typeof candidate.status === "number" ||
            candidate.status === null
        ) &&
        typeof candidate.message === "string"
    );
}


export function getApiErrorMessage(
    error: unknown
): string {
    if (isApiError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return DEFAULT_ERROR_MESSAGE;
}