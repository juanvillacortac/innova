import {groupingunitmeasure} from '../../../../models/masters-mpc/groupingunitmeasure'

export class MeasurementUnits {
    id: number = 0;
    name: string = "";
    abbreviation: string = "";
    groupingUnitofMeasure: groupingunitmeasure = new groupingunitmeasure();
    createdByUser: string = "";
    createdByUserId: number = 0;
    updatedByUser: string = "";
    active: boolean = false;
    initialSetup: boolean = false; 
}
