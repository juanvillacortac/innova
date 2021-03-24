import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { groupingInventoryReason } from 'src/app/models/ims/grouping-inventory-reasons';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { groupingInventoryReasonFilter } from '../shared/filter/grouping-inventory-reason-filter';
import { GroupinginventoryreasonService } from '../shared/service/groupinginventoryreason.service';

@Component({
  selector: 'grouping-inventory-reasons-panel',
  templateUrl: './grouping-inventory-reasons-panel.component.html',
  styleUrls: ['./grouping-inventory-reasons-panel.component.scss']
})
export class GroupingInventoryReasonsPanelComponent implements OnInit {

  @Input("_grouping") _grouping: groupingInventoryReason;
  @Input("showDialog") showDialog: boolean = true;
  @Input("filters") filters: groupingInventoryReasonFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  _validations:Validations=new Validations();

  constructor(private _groupingService: GroupinginventoryreasonService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.submitted = false;
    if(this._grouping.id<=0)
     this._grouping.active=true;
  }
  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._grouping = new groupingInventoryReason();
    this._grouping.active = true;

  }
  submit()
  {
    this.submitted = true;
      if (this._grouping.name.trim() )
      {
        if(this._grouping.name = this._grouping.name.trim())
        {
          if(this._grouping.name = this._grouping.name.charAt(0).toLocaleUpperCase() + this._grouping.name.substr(1).toLowerCase())
            {
              
                 this._grouping.id == 0 ? -1 : this._grouping.id;
                 this._groupingService.InsertUpdategroupingInventoryReasons(this._grouping).subscribe((data) => {
                 if (data> 0)
                  {
                     this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
                     this.showDialog = false;
                     this.showDialogChange.emit(this.showDialog);
                     this._grouping= new groupingInventoryReason();
                     this._grouping.active = true;               
                     this._groupingService.getgroupingInventoryReasonsList(this.filters = new groupingInventoryReasonFilter()).subscribe((data: groupingInventoryReason[]) => {
                     this._groupingService._groupingList = data;
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
        else
           this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La abreviatura debe ser diferente al nombre" });
      }
      
    } 

}
