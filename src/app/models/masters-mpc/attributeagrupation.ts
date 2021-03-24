import { IdentifierType } from "../security/IdentifierType";

export class Attributeagrupation {
    id: number = -1;
    name: string = "";
    description: string = "";
    createdByUserId: number = -1;
    createdByUser: string = "";
    updatedByUser: string = "";
    active: boolean = true;
    initialSetup: boolean = false;
}