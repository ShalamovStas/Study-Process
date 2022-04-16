export class OperationResult<T> {
    public success: boolean = false;

    constructor(public result: T) {
        this.success = false;
    }
}