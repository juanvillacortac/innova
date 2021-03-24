import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { Country } from 'src/app/models/masters/country';
import { Tax } from 'src/app/models/masters/tax';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxeTypeApplicationFilters } from 'src/app/models/masters/taxe-type-application-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { TaxeTypeApplicationService } from '../../taxe-type-application/shared/taxe-type-application.service';
import { TaxService } from '../shared/tax.service';

@Component({
  selector: 'app-tax-detail',
  templateUrl: './tax-detail.component.html',
  styleUrls: ['./tax-detail.component.scss']
})
export class TaxDetailComponent implements OnInit {
  countries: SelectItem<Country[]> = {value: null};
  taxeTypeApplication: TaxeTypeApplication[] =  null;
  selectedtaxeTypeApplication: TaxeTypeApplication[];
  isSelectedtaxeTypeApplication = false;
  taxForm: FormGroup;
  isEdit = false;
  formTitle: string;
  taxAdded: boolean;
  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() tax: Tax;
  @Input() taxList: Tax[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _taxService: TaxService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private _taxeTypeApplicationService: TaxeTypeApplicationService,
    private _countryService: CountryService) {  
    this.taxForm = this.setNewTaxForm();
  }
  ngOnInit(): void { 

    this.getCountriesPromise().then(()=>{
      this.getTaxesTypeApplicationsPromise().then(()=>{
        if(this.tax)
        { 
          this.formTitle="Editar impuesto"
          this.isEdit = true;  
          this.onEditForm();
        }
        else
        {
          this.formTitle="Nuevo impuesto"
          this.isEdit = false;
          this.taxForm.controls.statusValue.setValue('1'); 
        }
      });  
    });
  }
  onEditForm(){
             
    this.taxForm.patchValue({
              id: this.tax.id,
              name: this.tax.name,
              abbreviation: this.tax.abbreviation,       
              statusValue: this.tax.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
              selectedCountries: this.countries.value.find(p => Number(p.id) === Number(this.tax.country.id)),
              
  });
  this.selectedtaxeTypeApplication = [];
  this.addTaxeTypeApplicationSelected();
  this.isSelectedtaxeTypeApplication = true;
}

private addTaxeTypeApplicationSelected() {
  this.tax.taxeTypeApplication.forEach(element => {
    const taxeTypeEdited =this.taxeTypeApplication.find(p => element.id === p.id)
      if (taxeTypeEdited) {
        this.selectedtaxeTypeApplication.push(taxeTypeEdited);
      }
  });
}

onTaxeTypeApplicatioSelected(taxeTypeApplicationSelected){
  if(this.selectedtaxeTypeApplication?.length === 0)
   {
    this.isSelectedtaxeTypeApplication = false;
   }
   else
   {
    this.isSelectedtaxeTypeApplication = true;
   }
}

getCountriesPromise = () => {
  const filters =  new CountryFilter();
  filters.active = StatusEnum.active;
  return  this._countryService.getCountriesPromise(filters)
  .then(results => {
    this.countries.value = results;
  }, (error) => {
    this.messageService.add({key:'tax',severity: 'error', summary: 'Cargar paises', detail: error.error.message});
    console.log(error.error.message);
  });
}

getTaxesTypeApplicationsPromise = () => {
  const filters = new TaxeTypeApplicationFilters();
  filters.active = StatusEnum.active;
  return this._taxeTypeApplicationService.getTaxeTypeApplications(filters)
  .then(results => {
    this.taxeTypeApplication = results;
  }, (error) => {
    this.messageService.add({key:'tax',severity: 'error', summary: 'Cargar paises', detail: error.error.message});
    console.log(error.error.message);
  });
}

pushToSaveTaxeTypeApplication()
{
  if(this.isEdit)
  { 
    const newtaxeTypeApplications: TaxeTypeApplication[] = [];
    this.taxeTypeApplication.forEach(element => {
      const taxeTypeExisted = this.tax.taxeTypeApplication.find(p => element.id === p.id);
      const taxeTypeSelected = this.selectedtaxeTypeApplication.find(p => element.id === p.id);
        if (taxeTypeSelected) {
            newtaxeTypeApplications.push(taxeTypeSelected);
        }
        else if(taxeTypeExisted)
        {      
            element.active= false;
            newtaxeTypeApplications.push(element);
        }
    });
    return newtaxeTypeApplications;
  }
  else
  {
    return this.selectedtaxeTypeApplication;
  }
}

  toTaxModel(){
      let model = new Tax();

          model.id = this.taxForm.controls.id.value;
          model.name = this.taxForm.controls.name.value;
          model.abbreviation = this.taxForm.controls.abbreviation.value;
          model.active = this.taxForm.controls.statusValue.value === '0' ? false : true;
          model.taxeTypeApplication = this.pushToSaveTaxeTypeApplication();
          model.country = this.taxForm.controls.selectedCountries.value;

      return model;
  }

  onSave() { 
    const newTax = this.toTaxModel();
    if(this.isValidateTax(newTax))
    {
      this._taxService.addTax(newTax).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({ severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.onEmitHideForm(true);     
        }else if(data == -1){
          this.messageService.add({key:'tax', severity:'warn', summary:'Alerta', detail: "Este impuesto ya existe"});
        }else{
          this.messageService.add({key:'tax', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el impuesto"});
        }
      }, ()=>{
        this.messageService.add({key:'tax', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el impuesto"});
      });
    }
}
  isValidateTax(newTax: Tax)
  {
      let inValidateName = this.taxList.find(p=> p.name.trim().toUpperCase() === newTax.name.trim().toUpperCase() && p.country.id === newTax.country.id && p.id !== newTax.id);   
      let inValidateAbbreviation = this.taxList.find(p=> p.abbreviation.trim().toUpperCase() === newTax.abbreviation.trim().toUpperCase() && p.country.id === newTax.country.id && p.id !== newTax.id);
      
      if(inValidateName)
      {
        this.messageService.add({key:'tax', severity:'warn', summary:'Alerta', detail: "Ya existe un impuesto con el nombre ingresado en el pais " + inValidateName.country.name});
        return false;
      }

      if(inValidateAbbreviation)
      {
        this.messageService.add({key:'tax', severity:'warn', summary:'Alerta', detail: "Ya existe un impuesto con esa abreviatura ingresada en el pais " + inValidateAbbreviation.country.name});
        return false;
      }
      
      return true;
  }

  private setNewTaxForm() {
      return this.formBuilder.group({
        id:-1,
        name: ['', Validators.required],
        abbreviation: ['', Validators.required],
        selectedCountries:['', Validators.required],
        statusValue : ['', Validators.required]
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
}

