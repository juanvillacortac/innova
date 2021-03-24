import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {  MessageService , SelectItem } from 'primeng/api';
import { Brands } from 'src/app/models/masters/brands';
import { HttpErrorResponse } from '@angular/common/http';
import { brandsFilter } from '../shared/filters/brands-Filters';
import { BrandsService } from '../shared/services/brands.service';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations'


@Component({
  selector: 'app-brand-panel',
  templateUrl: './brand-panel.component.html',
  styleUrls: ['./brand-panel.component.scss']
})
export class BrandPanelComponent implements OnInit {

  @Input("_brand") _brand: Brands;
  @Input("showDialog") showDialog: boolean = true;
  @Input("filters") filters: brandsFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  brandClass: SelectItem<any>[];
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  _validations:Validations=new Validations();
  
  constructor(private _brandService: BrandsService,private messageService: MessageService) { }

  ngOnInit(): void 
{
    this.submitted = false;
    this._brandService.getBrandsClassList()
    .subscribe((data)=>{
      this.brandClass = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });   
    if(this._brand.id<=0)
     this._brand.active=true;
   }

    hideDialog(): void {
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
      this.submitted = false;
      this._brand = new Brands();
      this._brand.active = true;

    }
    submit()
    {
      this.submitted = true;
        if (this._brand.name.trim() && this._brand.idClass >0 )
        {
          if(this._brand.name = this._brand.name.trim())
          {
            if(this._brand.name = this._brand.name.charAt(0).toLocaleUpperCase() + this._brand.name.substr(1).toLowerCase())
            {
              if(this._brand.name.trim().toLocaleUpperCase() !== this._brand.abbreviation.trim())
              {   
                 this._brand.id == 0 ? -1 : this._brand.id;
                 this._brandService.InsertUpdateBrands(this._brand).subscribe((data) => {
                 if (data> 0)
                 {
                     this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
                     this.showDialog = false;
                     this.showDialogChange.emit(this.showDialog);
                     this._brand = new Brands();
                     this._brand.active = true;               
                     this._brandService.getBrandsList(this.filters = new brandsFilter()).subscribe((data: Brands[]) => {
                     this._brandService._brandsList = data;
                     this.submitted = false;
                    });
                  }
                 else
                  {
                   if(data==0)
                     this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
                   else if(data==-1)
                     this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El registro se encuentra duplicado" });
                   else
                     this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "El registro no se encuentra" });
                  }
               }, (error: HttpErrorResponse) => {
                   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
            });
            }
           }
          }
          else
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La abreviatura debe ser diferente al nombre" });
        }       
      }     
}
