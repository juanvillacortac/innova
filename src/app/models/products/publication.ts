export class Publication {
    id: number= -1;
    productId: number=-1;
    insertId : number=-1;
    createdByUserId:number=-1;
    updatedByUser: string="";
    createdByUser: string="";
    nameInsert:string="";
    name: string="";
    page: number;
    active: boolean = false;
    createdDate: Date;
}
