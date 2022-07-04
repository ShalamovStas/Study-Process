import { MemoCard as MemoCard, MemoCardCategory } from "./Card";

export class OperationResult<T> {
    public success: boolean = false;

    constructor(public result: T) {
        this.success = false;
    }
}

export class CreateMemoCardDialogModel {
    dialogTitle: string = "";
    saveBtnText: string = "Save";
    deck: MemoCard = new MemoCard();
    categories: MemoCardCategory[] = []
}

export class MemoCardCategoryDialogModel {
    dialogTitle: string = "";
    saveBtnText: string = "Save";
    categories: MemoCardCategory[] = []
    category: MemoCardCategory = new MemoCardCategory();
}

