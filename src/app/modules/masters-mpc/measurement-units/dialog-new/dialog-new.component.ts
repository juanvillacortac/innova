import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits'
import { MessageService, SelectItem } from 'primeng/api';
import { MeasurementunitsFilter } from '../../shared/filters/measurementunits-filter';
import { MeasurementunitsService } from '../../shared/services/measurementunits.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'dialog-new-MU',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponentMU implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_measurementunits") _measurementunits : measurementunits;
  @Input("filters") filters : MeasurementunitsFilter;
    submitted: boolean;
    refreshmeaunits : MeasurementunitsFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("onLoadMeasurementUnits") onLoadMeasurementUnits1 = new EventEmitter<MeasurementunitsFilter>();
  @Input("measurementunitsId") measurementunitsId : MeasurementunitsFilter;
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  aggrupationMU: SelectItem[];
  measurementunitsName: MeasurementunitsFilter = new MeasurementunitsFilter();
  searchlistname: measurementunits[];
  _validations: Validations = new Validations();
  

  constructor(private _measurementunitsservice: MeasurementunitsService, private messageService: MessageService) { }

  ngOnInit(): void {
    if(this._measurementunits.id == 0){
      this._measurementunits.active = true;
    }
    this.getGroupingUnitMeasureSelect();
    //this.onLoadMeasurementUnits()
  }
  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._measurementunits = new measurementunits();
    this._measurementunits.active = true;
    this.measurementunitsName = new MeasurementunitsFilter();
    this.measurementunitsId = new MeasurementunitsFilter();
  }

  saveMeasurementUnits(): void{
    this.submitted = true;
    if(this._measurementunits.name.trim() && this._measurementunits.idGroupingUnitofMeasure > 0 && this._measurementunits.name.trim().toLocaleUpperCase() != this._measurementunits.abbreviation.trim()){
       this._measurementunits.id = this._measurementunits.id == 0 ? -1 : this._measurementunits.id;
       this._measurementunits.name = this._measurementunits.name.trim();
       this._measurementunits.name = this._measurementunits.name.charAt(0).toLocaleUpperCase() + this._measurementunits.name.substr(1).toLowerCase();
          this._measurementunitsservice.postMeasurementUnits(this._measurementunits).subscribe((data: number) => {
            if(data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
              this._measurementunits = new measurementunits();
              this._measurementunits.active = true;
              this._measurementunitsservice.getMeasurementUnitsbyfilter(this.refreshmeaunits = new MeasurementunitsFilter()).subscribe((data: measurementunits[]) => {
                this._measurementunitsservice._measurementUnitsList = data;
              });
              this.submitted = false;
            }else if (data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "Este nombre ya está registrado"});
            }else if(data == -2){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "Esta abreviatura ya está registrada"});
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la unidad de medida"});
            }
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la unidad de medida"});
        });
    }
  }

  getGroupingUnitMeasureSelect(){
    this._measurementunitsservice.getGroupingUnitMeasure()
    .subscribe((data)=>{
      this.aggrupationMU = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  } 
}
