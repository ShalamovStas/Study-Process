import { AppHelper } from "./AppHelper";

export class MemoCardCategory {
    id: string = "";
    color: string = "";
    name: string = "";
    userId: string = "";
}

export class DefaultCategoryService {

    public static getDefaultCategory(): MemoCardCategory {
        const c = new MemoCardCategory();
        c.id = "0";
        c.name = "Cards with no category"

        return c;
    }
}

export class MemoCard {
    id: string = AppHelper.generateGuid();
    userId: string = '';
    title: string = '';
    items: Array<LearnModel> = [];
    categoryId: string | undefined 
}

export class LearnModel {
    id: string = AppHelper.generateGuid();
    frontSide: string = '';
    backSide: string = '';
    inUse: boolean = true;
}