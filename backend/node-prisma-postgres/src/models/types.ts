interface BaseResponse<T> {
  data: T | null;
  errorCode: number;
  errorMessage: string;
  success: boolean;
}
