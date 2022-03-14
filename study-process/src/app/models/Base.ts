export class OperationResult<T> {
    public success: boolean = false;

    constructor(public item: T) {
        this.success = false;
    }
}