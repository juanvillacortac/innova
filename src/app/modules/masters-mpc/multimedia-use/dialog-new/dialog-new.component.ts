import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { multimediause } from 'src/app/models/masters-mpc/multimediause'
import { MultimediauseService } from '../../shared/services/MultimediaUse/multimediause.service';
import { MultimediaUse } from '../../shared/view-models/multimedia-use.viewmodel'
import { MultimediauseFilter } from '../../shared/filters/multimediause-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'dialog-new-multimediause',
  templateUrl: './dialog-new.component.html',
  styleUrls: ['./dialog-new.component.scss']
})
export class DialogNewComponentMultimediaUse implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_multimediause") _multimediause: MultimediaUse;
  @Input("filters") filters: MultimediauseFilter;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshattrmultimedia: MultimediauseFilter;

  @Output() showDialogChange = new EventEmitter<boolean>();

  _validations: Validations = new Validations();

  constructor(private _multimediauseservice: MultimediauseService, private messageService: MessageService) { }

  ngOnInit(): void {
    if (this._multimediause.id <= 0 || this._multimediause.id == undefined) {
      this._multimediause.active = true;
      this._multimediause.maxAmount = 1;
    }
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._multimediause = new MultimediaUse();
    this._multimediause.active = true;
  }

  saveMultimediaUse(): void {
    debugger;
    this.submitted = true;
    if (this._multimediause.name.trim() && this._multimediause.maxAmount > 0) {
      this._multimediause.id = this._multimediause.id == 0 || this._multimediause.id == undefined ? - 1 : this._multimediause.id;
      this._multimediause.name = this._multimediause.name.trim();
       this._multimediause.name = this._multimediause.name.charAt(0).toLocaleUpperCase() + this._multimediause.name.substr(1).toLowerCase();
      this._multimediauseservice.postMultimediaUse(this._multimediause).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          this.showDialog = false;
          this._multimediause = new MultimediaUse();
          this._multimediause.active = true;
          this._multimediauseservice.getMultimediaUseList(this.refreshattrmultimedia = new MultimediauseFilter())
          this.submitted = false;
        } else if (data == -1) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este nombre ya est?? registrado" });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el uso de multimedia" });
        }
        //window.location.reload();
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar el uso de multimedia" });
      });
    }

  }

}
