import { AvakinItem } from "./avakinitem";
import { User } from "./proposal";

export class NameChangeProposal {
    id?: string;
    newTitle: string;
    item: AvakinItem;
    approved?: boolean;
    createdBy?: User;
    createdOn?: Date;
    actionedBy?: User;
    actionedOn?: Date;

    constructor(item: AvakinItem) {
        this.newTitle = "";
        this.item = item;
    }
}
