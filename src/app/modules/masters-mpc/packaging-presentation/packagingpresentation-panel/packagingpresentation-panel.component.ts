import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Packagingpresentation } from 'src/app/models/masters-mpc/packagingpresentation'
import { PackagingpresentationService } from '../../shared/services/PackagingPresentationService/packagingpresentation.service';
import { PackagingpresentationFilter } from '../../shared/filters/packagingpresentation-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { CommonService } from '../../shared/services/Common/common.service';

@Component({
  selector: 'packagingpresentation-panel',
  templateUrl: './packagingpresentation-panel.component.html',
  styleUrls: ['./packagingpresentation-panel.component.scss']
})
export class PackagingpresentationPanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_packagingpresentation") _packagingpresentation : Packagingpresentation;
  @Input("filters") filters : PackagingpresentationFilter;
    submitted: boolean;
    refreshmeaunits : PackagingpresentationFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _packingtype: SelectItem[];
  _validations: Validations = new Validations();
  constructor(private _packagingpresentationService: PackagingpresentationService, private messageService: MessageService, private _commonservice: CommonService) { }

  ngOnInit(): void {
    if(this._packagingpresentation.id == 0){
      this._packagingpresentation.active = true;
    }
    this.getPackingTypeSelect();
    //this.onLoadMeasurementUnits()
  }

  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._packagingpresentation = new Packagingpresentation();
    this._packagingpresentation.active = true;
  }

  savePackagingpresentation(): void{
    this.submitted = true;
    if(this._packagingpresentation.name.trim() && this._packagingpresentation.idPackingType != 0){
      
          this._packagingpresentation.id = this._packagingpresentation.id == 0 ? -1 : this._packagingpresentation.id;
          this._packagingpresentation.name = this._packagingpresentation.name.trim();
         this._packagingpresentation.name = this._packagingpresentation.name.charAt(0).toLocaleUpperCase() + this._packagingpresentation.name.substr(1).toLowerCase();
          this._packagingpresentationService.postPackagingpresentation(this._packagingpresentation).subscribe((data: number) => {
            if(data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
              this._packagingpresentation = new Packagingpresentation();
              this._packagingpresentation.active = true;
              this._packagingpresentationService.getPackagingpresentationbyfilter(this.refreshmeaunits = new PackagingpresentationFilter()).subscribe((data: Packagingpresentation[]) => {
                this._packagingpresentationService._PackagingPresentationList = data;
              });
              this.submitted = false;
            }else if(data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "Esta presentación de empaque está repetida"});
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la presentación de empaque"});
            }
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la presentación de empaque"});
          });
       
      
    }
  }
  getPackingTypeSelect(){
    this._commonservice.getPackingTypes()
    .subscribe((data)=>{
      this._packingtype = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }
}
