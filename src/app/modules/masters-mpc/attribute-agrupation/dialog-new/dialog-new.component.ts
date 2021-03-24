import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation';
import { AttributesagrupationFilter } from '../../shared/filters/attributesagrupation-filter';
import { AttributeagrupationService } from '../../shared/services/attributeagrupation.service';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { AttributeAgrupation } from '../../shared/view-models/attribute-agrupation.viewmodel';


@Component({
  selector: 'dialog-new',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_attributeagrupation") _attributeagrupation : AttributeAgrupation;
  @Input("filters") filters : AttributesagrupationFilter;
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
    submitted: boolean;
    refreshattragrupation : AttributesagrupationFilter;
  attributeagrupationname: AttributesagrupationFilter = new AttributesagrupationFilter();
  @Output() showDialogChange = new EventEmitter<boolean>();
  _validations: Validations = new Validations();
  permissionsIDs = {...Permissions};


  constructor(private _attributeagrupationservice: AttributeagrupationService,
              private messageService: MessageService,
              ) { }

  ngOnInit(): void {
    if(this._attributeagrupation.id == 0){
      this._attributeagrupation.active = true;
    }
  }

  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._attributeagrupation = new AttributeAgrupation();
    this._attributeagrupation.active = true;
  }

  saveAttributeAgrupation(): void{
    this.submitted = true;
    if(this._attributeagrupation.name.trim()){
      this._attributeagrupation.id = this._attributeagrupation.id == 0 ? -1 : this._attributeagrupation.id;
      this._attributeagrupation.name = this._attributeagrupation.name.trim();
       this._attributeagrupation.name = this._attributeagrupation.name.charAt(0).toLocaleUpperCase() + this._attributeagrupation.name.substr(1).toLowerCase();
          this._attributeagrupationservice.postAttributesAgrupation(this._attributeagrupation).subscribe((data: number) => {
            if(data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
              this._attributeagrupation = new AttributeAgrupation();
              this._attributeagrupation.active = true;
              this._attributeagrupationservice.getAttributesAgrupationbyfilter(this.refreshattragrupation = new AttributesagrupationFilter()).subscribe((data: Attributeagrupation[]) => {
                this._attributeagrupationservice._attributeAgrupationList = data;
              });
              this.submitted = false;
            }else if(data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "Esta agrupación de atributos ya existe"});
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la agrupación de atributos"});
            }
            //window.location.reload();
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la agrupación de atributos"});
          });
    }
  }
  
}
