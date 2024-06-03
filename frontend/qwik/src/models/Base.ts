export interface BaseResponseSchema<T> {
  success: boolean;
  errorCode: number;
  errorMessage: string;
  data: T | null;
}
