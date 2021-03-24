import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Area } from 'src/app/models/masters/area';
import { BranchofficeService } from '../../branchoffice/shared/services/branchoffice.service';
import { AreaFilter } from '../shared/filters/area-filter';
import { AreaService } from '../shared/services/area.service';

@Component({
  selector: 'app-area-panel',
  templateUrl: './area-panel.component.html',
  styleUrls: ['./area-panel.component.scss']
})
export class AreaPanelComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataArea") _dataArea: Area;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: AreaFilter;
  submitted: boolean;
  BranchOfficeList : SelectItem[];
  AreaTypeList : SelectItem[];
  statuslist: SelectItem[] = [ { 
    label: 'Activo', value: true},
  { label: 'Inactivo', value: false}];
  
  constructor(private _areaService : AreaService ,
    private _branchofficeService: BranchofficeService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.submitted = false;
    this._areaService.getareaTypeList()
    .subscribe((data)=>{
      this.AreaTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });  
    this._branchofficeService.getBranchOfficeList()
    .subscribe((data)=>{
      this.BranchOfficeList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    });  
    debugger 
    if(this._dataArea.id<=0)
    this._dataArea.active=true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataArea = new Area();
    this._dataArea.id = -1;
    this._dataArea.active = true;
  }


  
  saveArea() {
    this.submitted = true;
    if (this._dataArea.name != "" && this._dataArea.name.trim() && this._dataArea.idAreaType  > 0 && this._dataArea.idBranchOffice  > 0 ) {
     if(this._dataArea.name.trim().toLocaleUpperCase() !== this._dataArea.abbreviation.trim())
     {
      if(this._dataArea.name = this._dataArea.name.charAt(0).toLocaleUpperCase() + this._dataArea.name.substr(1).toLowerCase()){
      this._areaService.UpdateArea(this._dataArea).subscribe((data) => {
        
        if (data> 0) {
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.showDialog = false;
               this.showDialogChange.emit(this.showDialog);
               this._dataArea= new Area();
               this._dataArea.active = true;
               this._areaService.getareaList(this.filters = new AreaFilter()).subscribe((data: Area[]) => {
               this._areaService._areaList = data;
              });
              
              this.submitted = false;
              
              
            }else if(data == -1) {
              this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Ya existe un registro con este nombre" });
            } 
            else if(data == -2) {
              this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Ya existe un registro con esta abreviatura" });
            }
            else if(data == -3) {
              this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Este registro no existe" });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
            }
            //window.location.reload();
          }, () => {
            this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
          });
       
        }else {
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La abreviatura debe ser diferente al nombre" });
    }
  }
}
  }

}
