import { AppHelper } from "./AppHelper";

export class User {
    id: string =  AppHelper.generateGuid();
    name: string =  "";
    isEnabled: boolean = true;
}