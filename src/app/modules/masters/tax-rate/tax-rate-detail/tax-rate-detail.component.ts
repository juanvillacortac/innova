import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { ValueValidatorRateType } from 'src/app/helpers/confirmed.validator';
import { RateTypeEnum } from 'src/app/models/common/rate-type-enum';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { RateType } from 'src/app/models/masters/rate-type';
import { Tax } from 'src/app/models/masters/tax';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { TaxRate } from 'src/app/models/masters/tax-rate';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { TaxService } from '../../taxes/shared/tax.service';
import { TaxRateService } from '../shared/tax-rate.service';

@Component({
  selector: 'app-tax-rate-detail',
  templateUrl: './tax-rate-detail.component.html',
  styleUrls: ['./tax-rate-detail.component.scss']
})
export class TaxRateDetailComponent implements OnInit {
  rateType: SelectItem<RateType[]> = {value: null};
  tax: SelectItem<Tax[]> = {value: null};
  idRateType: number;
  idTax: number;
  taxRateForm: FormGroup;
  isAvailable = true;
  isEdit = false;
  formTitle: string;
  taxRateAdded: boolean;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() taxRate: TaxRate;
  @Input() taxRateList: TaxRate[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _taxRateService: TaxRateService,
    private _taxService: TaxService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {  
    this.taxRateForm = this.setNewTaxRateForm();
  }
  ngOnInit(): void { 

    this.getRatesTypePromise().then(()=>{
      this.getTaxesPromise().then(()=>{
            if(this.taxRate)
            { 
              this.formTitle="Editar tasa de impuesto"
              this.isEdit = true;  
              this.onEditForm();
            }
            else
            {
              this.formTitle="Nueva tasa de impuesto"
              this.isEdit = false;
              this.taxRateForm.controls.statusValue.setValue('1');  
            }
      });  
    });
}
  onEditForm(){
    if(this.taxRate.rateType.id === RateTypeEnum.formula)
    {
      this.taxRateForm.controls.value.disable();  
    }       
    this.taxRateForm.patchValue({
              id: this.taxRate.id,
              name: this.taxRate.name,
              abbreviation: this.taxRate.abbreviation,  
              value: Number(this.taxRate.value),     
              statusValue: this.taxRate.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
              selectedTax: this.tax.value.find(p => Number(p.id) === Number(this.taxRate.tax.id)),
              selectedRateType: this.rateType.value.find(p => Number(p.id) === Number(this.taxRate.rateType.id))
  });
}
  
getRatesTypePromise = () => {
  const filters =  StatusEnum.alls;
    return  this._taxRateService.getRatesType(filters)
    .then(results => {
      this.rateType.value = results;
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar tipo de tasas', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  getTaxesPromise = () => {
    const filters = new TaxFilters();
    filters.active = StatusEnum.active;;
    return this._taxService.getTaxes(filters)
    .then(results => {
      this.tax.value = results;
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar impuestos', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  
  onRateTypeSelected(rateType){
    if(rateType)
    {
      if(rateType.id === RateTypeEnum.formula)
      {
        this.taxRateForm.controls.value.setValue(0);
        this.taxRateForm.controls.value.disable();  
      }
      else
      {
        this.taxRateForm.controls.value.enable();  
      }
    }   
}

  toTaxRateModel(){
      let model = new TaxRate();

          model.id = this.taxRateForm.controls.id.value;
          model.name = this.taxRateForm.controls.name.value;
          model.abbreviation = this.taxRateForm.controls.abbreviation.value;
          model.active = this.taxRateForm.controls.statusValue.value === '0' ? false : true;
          model.rateType = this.taxRateForm.controls.selectedRateType.value;
          model.tax = this.taxRateForm.controls.selectedTax.value;
          model.value = Number(this.taxRateForm.controls.value.value);

      return model;
  }

  onSave() {
  
    const newTaxRate = this.toTaxRateModel();
    if(this.isValidateTaxRate(newTaxRate))
    {
      this._taxRateService.addTaxRate(newTaxRate).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({ severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.onEmitHideForm(true);     
        }else if(data == -1){
          this.messageService.add({key:'tax-rate', severity:'warn', summary:'Alerta', detail: "Esta tasa de impuesto ya existe"});
        }else{
          this.messageService.add({key:'tax-rate', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la tasa de impuesto"});
        }
      }, ()=>{
        this.messageService.add({key:'tax-rate', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la tasa de impuesto"});
      });
    }
}
  isValidateTaxRate(newTaxRate: TaxRate)
  {
      let inValidateName = this.taxRateList.find(p=> p.name.trim().toUpperCase() === newTaxRate.name.trim().toUpperCase() && p.id !== newTaxRate.id);   
      let inValidateAbbreviation = this.taxRateList.find(p=> p.abbreviation.trim().toUpperCase() === newTaxRate.abbreviation.trim().toUpperCase() && p.id !== newTaxRate.id);
      
      if(inValidateName)
      {
        this.messageService.add({key:'tax-rate', severity:'warn', summary:'Alerta', detail: "Ya existe una tasa de impuesto con el nombre ingresado"});
        return false;
      }

      if(inValidateAbbreviation)
      {
        this.messageService.add({key:'tax-rate', severity:'warn', summary:'Alerta', detail: "Ya existe una tasa de impuesto con esa abreviatura ingresada"});
        return false;
      }
      
      return true;
  }

  public resetForm() {
    if (this.taxRateForm.dirty) {
      this.confirmationService.confirm({
        message: '¿Desea cancelar el proceso de registrar tipo de aplicación impuesto?',
        accept: () => {
          this.taxRateForm.reset(this.setNewTaxRateForm());
          this.onEmitHideForm(false);
        }
      });
    } else {
      this.onEmitHideForm(false);
    }
  }

  private setNewTaxRateForm() {
      return this.formBuilder.group({
        id:-1,
        name: ['', Validators.required],
        abbreviation: ['', Validators.required],
        value: [0, Validators.required],
        statusValue : ['', Validators.required],
        selectedTax:['', Validators.required],
        selectedRateType:['', Validators.required]
      },
      {validators: ValueValidatorRateType('value', 'selectedRateType')});
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }

  public positiveVal(control:AbstractControl):{ [key: string]: any; } {
    if(this.taxRateForm.controls.selectedRateType.value !== RateTypeEnum.formula)
    {
      if (Number(control.value) <= 0) {
        return {nonZero: true};
      } else {
        return null;
      }
    }
    return null;
  }
  
}

