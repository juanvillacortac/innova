import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { ValidationrangeService } from '../../shared/services/ValidationRange/validationrange.service';
import { ValidationrangeFilter } from '../../shared/filters/validationrange-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { Typevalidationrange } from '../../../../models/masters-mpc/common/typevalidationrange';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'validationrange-dialog',
  templateUrl: './dialog-new-validationrange.component.html',
  styleUrls: ['./dialog-new-validationrange.component.scss']
})
export class DialogNewValidationrangeComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_validationrange") _validationrange: Validationrange;
  @Input("filters") filters: ValidationrangeFilter;
  submitted: boolean;
  refreshmeaunits: ValidationrangeFilter;
  @Output() showDialogChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  _validationtype: SelectItem[];

  _validations: Validations = new Validations();

  constructor(private _validationrangeService: ValidationrangeService, private messageService: MessageService) { }

  ngOnInit(): void {
    
    if (this._validationrange.id == 0) {
      this._validationrange.active = true;
      this._validationrange.typeValidationRange = new Typevalidationrange();
      this._validationrange.middle = 0;
    }
    this.getTypeValidationRangeSelect();
    //this.onLoadMeasurementUnits()
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._validationrange = new Validationrange();
    this._validationrange.active = true;
    this._validationrange.typeValidationRange = new Typevalidationrange();
  }

  saveValidationrange(): void {
    debugger;
    this.submitted = true;
    if (this._validationrange.name.trim() && this._validationrange.typeValidationRange.id != 0 && (this._validationrange.minimum <= this._validationrange.middle || this._validationrange.middle == 0) && (this._validationrange.middle <= this._validationrange.maximum || this._validationrange.middle == 0) && this._validationrange.minimum <= this._validationrange.middle && this._validationrange.minimum >= 0 && this._validationrange.middle >= 0 && this._validationrange.maximum > 0) {

      this._validationrange.id = this._validationrange.id == 0 ? -1 : this._validationrange.id;
      this._validationrange.name = this._validationrange.name.trim();
         this._validationrange.name = this._validationrange.name.charAt(0).toLocaleUpperCase() + this._validationrange.name.substr(1).toLowerCase();
      this._validationrangeService.postValidationRange(this._validationrange).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this._validationrange = new Validationrange();
          this._validationrange.active = true;
          this._validationrangeService.getValidationRangeList(this.refreshmeaunits = new ValidationrangeFilter())
          this.submitted = false;
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Rango duplicado" });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el rango de validaci??n" });
        }
      }, (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el rango de validaci??n" });
      });


    }
  }
  getTypeValidationRangeSelect() {
    this._validationrangeService.getTypeValidationRange()
      .subscribe((data) => {
        this._validationtype = data.map<SelectItem>((item) => ({
          label: item.name,
          value: item.id
        }));
      }, (error) => {
        console.log(error);
      });
  }
}
