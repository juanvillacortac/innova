import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption'
import { AttributeoptionService } from '../../shared/services/AttributeOptionService/attributeoption.service';
import { AttributeagrupationService } from '../../shared/services/attributeagrupation.service';
import { GroupingunitmeasureService } from '../../shared/services/GroupingUnitMeasureService/groupingunitmeasure.service';
import { MeasurementunitsService } from '../../shared/services/measurementunits.service';
import { AttributeoptionFilter } from '../../shared/filters/attributeoption-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { MeasurementunitsFilter } from '../../shared/filters/measurementunits-filter';
import { GroupingunitmeasureFilter } from '../../shared/filters/groupingunitmeasure-filter';
import { AttributesagrupationFilter } from '../../shared/filters/attributesagrupation-filter';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { MeasurementUnits } from '../../shared/view-models/measurement-units.viewmodel';
import { OrderCodes } from '../../shared/Utils/order-codes';

@Component({
  selector: 'app-attribute-option-panel',
  templateUrl: './attribute-option-panel.component.html',
  styleUrls: ['./attribute-option-panel.component.scss']
})
export class AttributeOptionPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_attributeoption") _attributeoption : Attributeoption;
  @Input("filters") filters : AttributeoptionFilter;
    submitted: boolean;
    refreshPOT : AttributeoptionFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _validations: Validations = new Validations();

  _idgroupingunitmeasure: number;
  
  _attributeagrupation: SelectItem[];
  _groupingunitmeasure: SelectItem[];
  _measurementunit: SelectItem[];
  
  constructor(private _attributeoptionService: AttributeoptionService, 
    private messageService: MessageService,
    private _attributeagrupationService: AttributeagrupationService, 
    private _groupingunitmeasureService: GroupingunitmeasureService,
    private _measurementunitsService: MeasurementunitsService) { }

  ngOnInit(): void {
    if(this._attributeoption.id == 0 || this._attributeoption.id == undefined){
      this._attributeoption.active = true;
      this._attributeoption.attributeAgrupation = new Attributeagrupation();
      this._attributeoption.measurementUnit = new measurementunits();
      this._idgroupingunitmeasure = -1;
    }else{
      this._idgroupingunitmeasure = this._attributeoption.measurementUnit.idGroupingUnitofMeasure;
      this.listmeasurementunits();
    }
    
   
    this.filters.active = 1;
    var filterA = new AttributesagrupationFilter();
    filterA.active = 1;
    this._attributeagrupationService.getAttributesAgrupationbyfilter(filterA, OrderCodes.Name)
      .subscribe((data) => {
        this._attributeagrupation = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
    
    
    var filterG = new GroupingunitmeasureFilter();
    filterG.active = 1;
    this._groupingunitmeasureService.getGroupingUnitMeasurebyfilter(filterG, OrderCodes.Name)
      .subscribe((data) => {
        this._groupingunitmeasure = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

  listmeasurementunits(){
    var filterM = new MeasurementunitsFilter(); 
    filterM.idGroupingUnitofMeasure = this._idgroupingunitmeasure;
    filterM.active = 1;

    this._measurementunitsService.getMeasurementUnitsbyfilter(filterM, OrderCodes.Name)
      .subscribe((data) => {
        this._measurementunit = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }




  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._attributeoption = new Attributeoption();
    this._attributeoption.active = true;
  }
  saveAttributeoption(): void{
    this.submitted = true;
    if(this._attributeoption.name.trim()){
      debugger;
      this._attributeoption.id = this._attributeoption.id == 0 || this._attributeoption.id == undefined ? -1 : this._attributeoption.id;
      this._attributeoption.name = this._attributeoption.name.trim();
      this._attributeoption.name = this._attributeoption.name.charAt(0).toLocaleUpperCase() + this._attributeoption.name.substr(1).toLowerCase();
      this._attributeoptionService.postAttributeoption(this._attributeoption).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this._attributeoption = new Attributeoption();
          this._attributeoption.attributeAgrupation = new Attributeagrupation();
          this._attributeoption.measurementUnit = new measurementunits();
          this._attributeoption.active = true;
          this._attributeoptionService.getAttributeoptionbyfilter(this.refreshPOT = new AttributeoptionFilter(), OrderCodes.UpdatedDate).subscribe((data: Attributeoption[]) => {
            this._attributeoptionService._AttributeoptionList = data;
          });
          this.submitted = false;
        }else if(data == -1){
          this.messageService.add({severity:'error', summary:'Error', detail: "Esta opción de atributo ya existe"});
        } else if (data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Esta abreviatura ya está registrada" });
        } else if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Esta opción esta asociada a un atributo y no puede ser inactivada" });
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la opción"});
        }
      }, (error: HttpErrorResponse)=>{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la opción"});
      });
       
      
    }



  }

}
