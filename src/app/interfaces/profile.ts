import { Scope } from "./scope";

export interface Profile {
    id: number;
    code: string;
    description: string;
    scope: Scope;
    creationDate: Date;
    updateDate: Date;
    lastUpdateUserId: string;
}