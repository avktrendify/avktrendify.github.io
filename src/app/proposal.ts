import { AvakinItem } from "./avakinitem";

export class Proposal {
    id?: string;
    name?: string;
    matchups: ItemMatchup[];
    createdBy?: User;
    createdOn?: Date;
    isActive: boolean;

    constructor(proposal?: any) {
        if (proposal === undefined) {
            this.matchups = [];
            this.isActive = true;
        }
        else {
            this.createdBy = proposal.createdBy;
            this.id = proposal.id;
            this.name = proposal.name;
            this.matchups = proposal.matchups;
            this.isActive = proposal.isActive;
            this.createdOn = new Date(proposal.createdOn);
        }
        
    }

    addMatchup(item: AvakinItem): void {
        this.matchups.push({id: -1, item: item, users: []});
    }
}

export interface ItemMatchup {
    id: number;
    item: AvakinItem;
    users: User[];
}

export interface User {
    id?: string;
    username?: string;
    password?: string;
    canCreate?: boolean;
    canDelete?: boolean;
    isAdmin?: boolean;
}