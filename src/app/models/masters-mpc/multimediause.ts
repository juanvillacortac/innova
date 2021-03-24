import { IdentifierType } from "../security/IdentifierType";

export interface multimediause {
  id: number;
  name: string;
  description: string;
  maxAmount: number;
  createdByUserId: number;
  createdByUser: string;
  updatedByUserId: number;
  updatedByUser: string;
  createdDate: Date;
  updatedDate: Date;
  active: boolean;
  initialSetup: boolean;
}
