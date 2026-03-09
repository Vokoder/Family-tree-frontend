export class HttpError extends Error {
  status: number;
  constructor(status: number = 500, message: string) {
    super(message);
    this.status = status;
  }
}
