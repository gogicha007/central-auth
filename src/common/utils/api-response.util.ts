import { ApiResponse } from "../types/api-response.type";

export function ok<T>(message: string, data: T | null = null): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
    }
}