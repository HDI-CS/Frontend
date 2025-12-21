export type BaseResponse = {
  code: string;
  message: string;
};

export type ApiResponse<T = undefined> = BaseResponse & {
  result?: T;
};
