export interface ApiResponse<T> {
    status: number;
    data: T;
    error?: string;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}
