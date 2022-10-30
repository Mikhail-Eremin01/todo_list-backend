export default class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors:Error[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, "User is not authorized");
    }

    static BadRequest(message: string, errors:Error[] = []) {
        return new ApiError(400, message, errors);
    }
};
