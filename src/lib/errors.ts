export type ErrorLevel = "application" | "repository" | "presentation";

export enum ErrorCode {
  INVALID_INPUT = "invalid-input",
  INVALID_ID = "invalid-id",
  INVALID_OPERATION = "invalid-operation",
  DUPLICATED_RECORD = "duplicated-record",
  ID_NOT_PROVIDED = "id-not-provided",
  NOT_FOUND = "not-found",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  APPLICATION_INTEGRITY_ERROR = "application-integrity-error",
}

export interface BaseErrorParams {
  [key: string]: string | number | boolean;
}

export class RepositoryError extends Error {
  public rawMessage: string;

  constructor(
    rawMessage: string,
    public errorCode: ErrorCode,
    public errorParams: BaseErrorParams = {}
  ) {
    super(`[${new Date().toISOString()}] - [repository] ${rawMessage}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RepositoryError);
    }

    this.rawMessage = rawMessage;
  }
}