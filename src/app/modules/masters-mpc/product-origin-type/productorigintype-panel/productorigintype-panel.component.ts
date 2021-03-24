import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Productorigintype } from 'src/app/models/masters-mpc/productorigintype'
import { ProductorigintypeService } from '../../shared/services/ProductOriginType/productorigintype.service';
import { ProductorigintypeFilter } from '../../shared/filters/productorigintype-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'productorigintype-panel',
  templateUrl: './productorigintype-panel.component.html',
  styleUrls: ['./productorigintype-panel.component.scss']
})
export class ProductorigintypePanelComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("_productorigintype") _productorigintype : Productorigintype;
  @Input("filters") filters : ProductorigintypeFilter;
    submitted: boolean;
    refreshPOT : ProductorigintypeFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  _validations: Validations = new Validations();
  
  constructor(private _productorigintypeService: ProductorigintypeService, private messageService: MessageService) { }

  ngOnInit(): void {
    if(this._productorigintype.id == 0){
      this._productorigintype.active = true;
    }
  }
  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._productorigintype = new Productorigintype();
    this._productorigintype.active = true;
  }
  saveProductorigintype(): void{
    this.submitted = true;
    if(this._productorigintype.name.trim()){
      
          this._productorigintype.id = this._productorigintype.id == 0 ? -1 : this._productorigintype.id;
          this._productorigintype.name = this._productorigintype.name.trim();
         this._productorigintype.name = this._productorigintype.name.charAt(0).toLocaleUpperCase() + this._productorigintype.name.substr(1).toLowerCase();
          this._productorigintypeService.postProductorigintype(this._productorigintype).subscribe((data: number) => {
            if(data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
              this._productorigintype = new Productorigintype();
              this._productorigintype.active = true;
              this._productorigintypeService.getProductorigintypebyfilter(this.refreshPOT = new ProductorigintypeFilter()).subscribe((data: Productorigintype[]) => {
                this._productorigintypeService._ProductorigintypeList = data;
              });
              this.submitted = false;
            }else if(data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "Este tipo de origen ya existe"});
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de origen"});
            }
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de origen"});
          });
       
      
    }
  }
}
