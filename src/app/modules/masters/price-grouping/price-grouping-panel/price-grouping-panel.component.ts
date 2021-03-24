import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { priceGrouping } from 'src/app/models/masters/price-grouping';
import { PriceGroupingFilter } from '../shared/filters/pricegrouping-filter';
import { PriceGroupingService } from '../shared/service/price-grouping.service';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations'

@Component({
  selector: 'app-price-grouping-panel',
  templateUrl: './price-grouping-panel.component.html',
  styleUrls: ['./price-grouping-panel.component.scss']
})
export class PriceGroupingPanelComponent implements OnInit {

  @Input("_pricegrouping") _pricegrouping: priceGrouping;
  @Input("showDialog") showDialog: boolean = true;
  @Input("filters") filters: PriceGroupingFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  _validations:Validations=new Validations();

  constructor(private _pricegroupingService: PriceGroupingService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.submitted = false;
    if(this._pricegrouping.id<=0)
     this._pricegrouping.active=true;
  }
  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._pricegrouping = new priceGrouping();
    this._pricegrouping.active = true;

  }
  submit()
  {
    this.submitted = true;
      if (this._pricegrouping.name.trim() )
      {
        if(this._pricegrouping.name = this._pricegrouping.name.trim())
        {
          if(this._pricegrouping.name = this._pricegrouping.name.charAt(0).toLocaleUpperCase() + this._pricegrouping.name.substr(1).toLowerCase())
            {
              if(this._pricegrouping.name.trim().toLocaleUpperCase() !== this._pricegrouping.abbreviation.trim())
              {
                 this._pricegrouping.id == 0 ? -1 : this._pricegrouping.id;
                 this._pricegroupingService.InsertUpdatePriceGrouping(this._pricegrouping).subscribe((data) => {
                 if (data> 0)
                  {
                     this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
                     this.showDialog = false;
                     this.showDialogChange.emit(this.showDialog);
                     this._pricegrouping= new priceGrouping();
                     this._pricegrouping.active = true;               
                     this._pricegroupingService.getPriceGroupingList(this.filters = new PriceGroupingFilter()).subscribe((data: priceGrouping[]) => {
                     this._pricegroupingService._pricegroupingList = data;
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
