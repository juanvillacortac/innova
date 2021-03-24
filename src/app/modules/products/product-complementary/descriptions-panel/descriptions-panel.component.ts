import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { DescriptionType } from 'src/app/models/masters-mpc/description-type';
import { Country } from 'src/app/models/masters/country';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { DescriptionTypeFilter } from 'src/app/modules/masters-mpc/shared/filters/descriptionType-filter';
import { DescriptionTypeService } from 'src/app/modules/masters-mpc/shared/services/DescriptionType/description-type.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CountryFilter } from 'src/app/modules/masters/country/shared/filters/country-filter';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { Description } from '../../../../models/products/decription';

@Component({
  selector: 'descriptions-panel',
  templateUrl: './descriptions-panel.component.html',
  styleUrls: ['./descriptions-panel.component.scss']
})
export class DescriptionsPanelComponent implements OnInit {
  
  @Input("showDialog") showDialog : boolean = false;
  @Input("_descriptionListTemp") _descriptionListTemp: Description[];
  @Output() descriptionListChange = new EventEmitter<Description[]>();
  _validations: Validations = new Validations();
  submitted: boolean;
  @Input("_description") _description : Description;
  @Output() showDialogChange = new EventEmitter<boolean>();
  countryList: SelectItem[];
  descriptionTypeList: SelectItem[];
  statusList: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  @Output("refreshchange") refreshchange = new EventEmitter<number>();
  
  constructor(private _countryservice: CountryService,
    private _descriptiontypeservice: DescriptionTypeService,
    private messageService: MessageService,
    private _httpClient: HttpClient) { }

    _Authservice : AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    if(!this._description.edit){
      this._description.active = true;
    }
    this.onLoadCountrysList();
    this.onLoadDescriptionTypesList();
  }

  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._description = new Description();
  }

  async onLoadCountrysList(){
    var filter: CountryFilter = new CountryFilter()
    filter.active = 1;
    this._countryservice.getCountriesList(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.countryList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  async onLoadDescriptionTypesList(){
    var filter: DescriptionTypeFilter = new DescriptionTypeFilter()
    filter.active = 1;
    this._descriptiontypeservice.getDescriptionbyfilter(filter)
    .subscribe((data)=>{
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.descriptionTypeList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  addDescription(){
    this.submitted = true;
    if (this._description.countryId > 0 && this._description.descriptionTypeId > 0 && this._description.description.trim()) {
      if (!this._description.edit) {
        if (this._descriptionListTemp.filter(x => x.countryId == this._description.countryId && x.descriptionTypeId == this._description.descriptionTypeId).length <= 0) {
          const { fullName } = this._Authservice.storeUser;
          this._description.description = this._description.description.trim();
          this._description.description = this._description.description.charAt(0).toLocaleUpperCase() + this._description.description.substr(1).toLowerCase();
          this._description.country = new Country();
          this._description.descriptionType = new DescriptionType();
          this._description.idDescription = this._descriptionListTemp.length + 1;
          this._description.country.name = this.countryList.find(x => x.value == this._description.countryId).label;
          this._description.descriptionType.name = this.descriptionTypeList.find(x => x.value == this._description.descriptionTypeId).label;
          this._description.createdDate = this._description.createdDate != null ? this._description.createdDate : new Date();
          this._description.createdByUser = fullName;
          this.refreshchange.emit();
          this._descriptionListTemp.push(this._description);
          this.descriptionListChange.emit(this._descriptionListTemp);
          this.submitted = false;
          this.messageService.add({severity:'success', summary:'Agregado', detail: "Agregado con éxito"});
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: "Esta descripción ya existe"});
        }
      } else {
        var listdescription = [];
        listdescription = this._descriptionListTemp.filter(x => x.idDescription != this._description.idDescription);
        listdescription = listdescription.length == 0 ? this._descriptionListTemp.filter(x => x.id != this._description.id) : listdescription;
        if (listdescription.filter(x => x.countryId == this._description.countryId && x.descriptionTypeId == this._description.descriptionTypeId).length <= 0) {
          var description = this._description.idDescription == undefined ? this._descriptionListTemp.findIndex(x => x.id == this._description.id) : this._descriptionListTemp.findIndex(x => x.idDescription == this._description.idDescription);
          this._descriptionListTemp[description] = this._description;
          this._description.description = this._description.description.trim();
          this._description.description = this._description.description.charAt(0).toLocaleUpperCase() + this._description.description.substr(1).toLowerCase();
          this._description.country = new Country();
          this._description.descriptionType = new DescriptionType();
          this._description.country.name = this.countryList.find(x => x.value == this._description.countryId).label;
          this._description.descriptionType.name = this.descriptionTypeList.find(x => x.value == this._description.descriptionTypeId).label;
          this._description.createdDate = this._description.createdDate != null ? this._description.createdDate : new Date();
          this.refreshchange.emit();
          this.descriptionListChange.emit(this._descriptionListTemp);
          this.submitted = false;
          this.messageService.add({severity:'success', summary:'Agregado', detail: "Agregado con éxito"});
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: "Esta descripción ya existe"});
        }
      }
    }
  }
}
