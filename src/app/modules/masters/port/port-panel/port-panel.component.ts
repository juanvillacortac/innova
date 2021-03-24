import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Port} from '../../../../models/masters/port';
import {PortFilter} from '../shared/filters/port-filter';
import {PortService} from '../shared/services/port.service';
import { MessageService, SelectItem } from 'primeng/api';
import { CountryService } from '../../country/shared/services/country.service';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
@Component({
  selector: 'app-port-panel',
  templateUrl: './port-panel.component.html',
  styleUrls: ['./port-panel.component.scss']
})
export class PortPanelComponent implements OnInit {
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataPort") _dataPort: Port ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: PortFilter;
  _validations : Validations = new Validations();
    submitted: boolean;
    countriesList : SelectItem[];
    statuslist: SelectItem[] = [ { 
      label: 'Activo', value: true},
    { label: 'Inactivo', value: false}];
    constructor( private _portService: PortService, private messageService: MessageService,private _countriesService : CountryService) { }

  ngOnInit(): void {
    this.submitted = false;
    this._countriesService.getCountriesList()
    .subscribe((data)=>{
      this.countriesList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    }); 
    if(this._dataPort.id<=0)
    this._dataPort.active=true;  
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataPort = new Port();
    this._dataPort.id = -1;
    this._dataPort.active = true;
  }

  savePort() {
    this.submitted = true;
    if (this._dataPort.name != "" && this._dataPort.name.trim() && this._dataPort.idCountry  > 0) {
     if(this._dataPort.name.trim().toLocaleUpperCase() !== this._dataPort.abbreviation.trim())
     {
      if(this._dataPort.name = this._dataPort.name.charAt(0).toLocaleUpperCase() + this._dataPort.name.substr(1).toLowerCase()){
      this._portService.UpdatePorts(this._dataPort).subscribe((data) => {
        
        if (data> 0) {
               this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.showDialog = false;
               this.showDialogChange.emit(this.showDialog);
               this._dataPort= new Port();
               this._dataPort.active = true;
               this._portService.getPortsList(this.filters = new PortFilter()).subscribe((data: Port[]) => {
               this._portService._portsList = data;
              });
              
              this.submitted = false;
              
              
            }else if(data == -1) {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Ya existe un registro con este nombre" });
            } 
            else if(data == -2) {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Ya existe un registro con esta abreviatura" });
            }
            else if(data == -3) {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Este registro no existe" });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
            }
            //window.location.reload();
          }, () => {
            this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
          });
       
        }else {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "La abreviatura debe ser diferente al nombre" });
    }
  }
  }
}
}
