import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Gtintype } from 'src/app/models/masters-mpc/gtintype'
import { MessageService, SelectItem } from 'primeng/api';
import { GtintypeFilter } from '../../shared/filters/gtintype-filter';
import { GtintypeService } from '../../shared/services/GtinType/gtintype.service';
import { Validations } from '../../shared/Utils/Validations/Validations';
import { Gtingrouping } from '../../../../models/masters-mpc/common/gtingrouping';

@Component({
  selector: 'app-gtintype-panel',
  templateUrl: './gtintype-panel.component.html',
  styleUrls: ['./gtintype-panel.component.scss']
})
export class GtintypePanelComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_gtintype") _gtintype: Gtintype;
  @Input("filters") filters: GtintypeFilter;
  submitted: boolean;
  refreshmeaunits: GtintypeFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    { label: 'Seleccione...', value: undefined },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  alphanumeric: SelectItem[] = [
    { label: 'Seleccione...', value: undefined },
    { label: 'Si', value: true },
    { label: 'No', value: false },
  ];
  checkDigit: SelectItem[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false },
  ];
  _gtingrouping: SelectItem[];

  _validations: Validations = new Validations();

  constructor(private _gtintypeService: GtintypeService, private messageService: MessageService) { }

  ngOnInit(): void {

    if (this._gtintype.id == 0) {
      this._gtintype.active = true;
      this._gtintype.digitAmount = 1;
      this._gtintype.gtinGrouping = new Gtingrouping();
      this._gtintype.alphanumeric = undefined;
      this._gtintype.checkDigit = undefined;
    }
    this.getGtinGroupingSelect();
  }

  hideDialog(): void {
    debugger;
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._gtintype = new Gtintype();
    this._gtintype.active = true;
    this._gtintype.gtinGrouping = new Gtingrouping();
  }

  saveGtintype(): void {
    debugger;
    this.submitted = true;
    if (this._gtintype.name.trim() && this._gtintype.digitAmount > 0 && this._gtintype.gtinGrouping.id != 0) {

      this._gtintype.id = this._gtintype.id == 0 ? -1 : this._gtintype.id;
      this._gtintype.name = this._gtintype.name.trim();
      this._gtintypeService.postGtinType(this._gtintype).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this._gtintype = new Gtintype();
          this._gtintype.active = true;
          this._gtintypeService.getGtinTypeList(this.refreshmeaunits = new GtintypeFilter())
          this.submitted = false;
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Nombre de tipo gtin duplicado" });
        } else if (data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Esta abreviatura ya está registrada" });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el tipo GTIN" });
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el tipo gtin" });
      });


    }
  }


  getGtinGroupingSelect() {
    this._gtintypeService.getGtinGrouping()
      .subscribe((data) => {
        this._gtingrouping = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }

}
