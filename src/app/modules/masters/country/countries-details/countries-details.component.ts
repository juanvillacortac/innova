import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryService } from '../shared/services/country.service';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Country } from 'src/app/models/masters/country';
import { CountryFilter } from '../shared/filters/country-filter';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations'


@Component({
  selector: 'app-countries-details',
  templateUrl: './countries-details.component.html',
  styleUrls: ['./countries-details.component.scss']
})

export class CountriesDetailsComponent implements OnInit {
 
  @Input("showDialog") showDialog: boolean = true;
  @Input("_dataCountry") _dataCountry: Country ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: CountryFilter;
  statuslist: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  submitted: boolean;
  _validations:Validations=new Validations();

  constructor(private _countryService: CountryService,  private messageService: MessageService,
    private confirmationService: ConfirmationService,private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.submitted = false;
    if(this._dataCountry.id<=0)
     this._dataCountry.active=true;
     this.primengConfig.ripple = true;
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._dataCountry = new Country();
    this._dataCountry.active = true;
  }
  
  saveCountry() 
  {
    this.submitted = true;
    if (this._dataCountry.name != "")
    {
      if( this._dataCountry.name = this._dataCountry.name.trim())
      {
        if(this._dataCountry.name = this._dataCountry.name.charAt(0).toLocaleUpperCase() + this._dataCountry.name.substr(1).toLowerCase())
        {
         if(this._dataCountry.name.trim().toLocaleUpperCase() !== this._dataCountry.abbreviation.trim())
         {         
              this._dataCountry.id == 0 ? -1 : this._dataCountry.id;
              if(this._dataCountry.active)
              {
                this._countryService.UpdateCountry(this._dataCountry).subscribe((data) => 
               {
                if (data> 0) 
                {
                  this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
                  this.showDialog = false;
                  this.showDialogChange.emit(this.showDialog);
                  this._dataCountry = new Country();
                  this._dataCountry.active = true;
                  this._countryService.getCountriesList(this.filters = new CountryFilter()).subscribe((data: Country[]) => {
                   this._countryService._countriesList = data;
                    this.submitted = false;
                   });
                  this.submitted = false;
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
                }, (error: HttpErrorResponse) =>
                {
                  this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
                });
              }
             else{
                this.confirmationService.confirm({
                header: 'Confirmación',
                icon: 'pi pi-exclamation-triangle',
                message: 'Si inactiva un país las configuraciones asociadas\ a este se dejaran de visualizar, desea proceder con la acción?',
                accept: () => {
                  this._countryService.UpdateCountry(this._dataCountry).subscribe((data) => 
                {
                 if (data> 0) 
                 {
                  this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
                  this.showDialog = false;
                  this.showDialogChange.emit(this.showDialog);
                  this._dataCountry = new Country();
                  this._dataCountry.active = true;
                  this._countryService.getCountriesList(this.filters = new CountryFilter()).subscribe((data: Country[]) => {
                   this._countryService._countriesList = data;
                    this.submitted = false;
                   });
                  this.submitted = false;
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
            this.messageService.add({ severity: 'error', summary: 'Guardado', detail: "Ha ocurrido un error al guardar los datos" });
          });
          },
          });
         }
      }
        else
          this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "La abreviatura debe ser diferente al nombre" }); 
      }
    }
  }
 }
}
