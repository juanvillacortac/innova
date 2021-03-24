import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Address } from 'src/app/models/masters/address';
import { CityService } from 'src/app/modules/masters/city/shared/services/city.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { DistrictService } from 'src/app/modules/masters/district/shared/services/district.service';
import { PlaceTypesServiceService } from 'src/app/modules/masters/places-types/shared/services/place-types-service.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';
import{Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { StateService } from 'src/app/modules/masters/state/shared/services/state.service';
import { StateFilters } from 'src/app/models/masters/state-filters';
declare var google:any;

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {

  identifierToEdit: number = -1;
  _validations:Validations=new Validations();
  
  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{address: Address, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();

  addressTypeList: SelectItem[];
  submitted: boolean;
  address: Address = new Address();
  form: FormGroup;
  countriesList: SelectItem[];
  statesList: SelectItem[];
  citiesList: SelectItem[];
  municipalitiesList: SelectItem[];
  housingTypesList: SelectItem[];
  acceptGuion: RegExp = /^[a-zA-Z0-9À-ú_-]*$/
  options: any;
  overlays: any[];
  dialogVisible: boolean;
  markerTitle: string;
  selectedPosition: any;
  infoWindow: any;
  draggable: boolean;

  constructor(
    private commonService: CommonMastersService, 
    private _countryService: CountryService, 
    private _stateService: StateService, 
    private _districtService: DistrictService, 
    private _cityService: CityService,
     private _placeTypesServiceService: PlaceTypesServiceService
  ) { }

  ngOnInit(): void {
    this.submitted = false;
    this.initForm();
    this.commonService.getAddressTypes({
      id: -1
    }).subscribe((data)=>{
      this.addressTypeList = data.filter(x=>x.id != 0).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });
 

    this.commonService.getHousingTypes().subscribe((data)=>{      
      this.housingTypesList = data.filter(x=>x.id != 0).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });

    this._countryService.getCountriesList({
      active: 1,
      idCountry: -1,
      name:"",
      abbreviation:""
    }).subscribe((data)=>{
      this.countriesList = data.map((item)=>(
        {
          label: item.name,
          value: item.id
        }
      ))
    }); 

    //this.loadCountries();

    this.loadStates();

    this.loadMunicipalities();

    this.loadCities();
    this.options = {
      center: {lat: 10.97774, lng: -63.95278},
      zoom: 9
     };
     this.initOverlays();
  }

  handleMapClick(event) {
    this.selectedPosition = event.latLng;
  }
  initOverlays() {
    if (!this.overlays||!this.overlays.length) {
      if(this.address.id <=0 || this.address.id==undefined){
        this.overlays = [
            new google.maps.Marker({position: {lat: 10.97774, lng: -63.95278}, title:"Marcador", draggable: true}),
           
        ];     
    } 
    else{
    this.overlays = [
      new google.maps.Marker({position: {lat: this.address.latitude, lng: this.address.length}, title:"Marcador", draggable: true}),     
  ];
   }
   }
  }

  handleDragEnd(event) {
    debugger
      this.address.latitude=event.overlay.internalPosition.lat();
      this.address.length=event.overlay.internalPosition.lng();
      
  } 
  submit() {
 
    if(this.form.valid){
      this.address.country = this.countriesList.find(x=>x.value == this.address.idCountry).label;
      this.address.state = this.statesList.find(x=>x.value == this.address.idState).label;
      this.address.city = this.citiesList.find(x=>x.value == this.address.idCity).label;
      this.address.municipality = this.municipalitiesList.find(x=>x.value == this.address.idMunicipality).label;
      this.address.addressType = this.addressTypeList.find(x=>x.value == this.address.idAddressType).label;
      this.submitted = true;
      this.onSubmit.emit({
        address: this.address,
        identifier: this.identifierToEdit
      });   
      this.visible = false;
      this.emitVisible();
    }
  }

  initForm(){
    this.form = new FormGroup({
      country: new FormControl(this.address.idCountry, [
        Validators.required
      ]),
      state: new FormControl(this.address.idState, [
        Validators.required
      ]),
      municipality: new FormControl(this.address.idMunicipality, [
        Validators.required
      ]),
      city: new FormControl(this.address.idCity, [
        Validators.required
      ]),
      addressType: new FormControl(this.address.idAddressType, [
        Validators.required
      ]),                        
      housingType: new FormControl(this.address.idHousingType, [
        Validators.required
      ]),      
      street : new FormControl(this.address.street,[
        Validators.required
      ]),
      avenue : new FormControl(this.address.avenue),
      edifice : new FormControl(this.address.edifice),
      floor : new FormControl(this.address.floor),
      apartament : new FormControl(this.address.apartament),
      postalCode : new FormControl(this.address.postalCode),
      references : new FormControl(this.address.references),
      latitude  : new FormControl(this.address.latitude),
      length    : new FormControl(this.address.length)
    });
  }

  onShow(){
    this.emitVisible();
    this.ngOnInit();
  }

  onHide(){
    this.emitVisible();
    this.address = new Address(); 
    this.identifierToEdit = -1;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  edit(contactNumber: Address, identifier: number){
    this.address = Object.assign({},contactNumber);
    this.identifierToEdit = identifier;
    this.visible = true;
  }

 






  // loadCountries(){
  //   this._placeTypesServiceService.getCountriesList()
  //   .subscribe((data)=>{
  //     this.housingTypesList = data.map<SelectItem>((item)=>(
  //       {
  //         label: item.name,
  //         value: item.id
  //       }
  //     ));
  //   })
  // }

  loadStates() {    
    debugger;
    this.statesList = [];
    this._stateService.getStates({
      idState: -1,
      idCountry: this.address.idCountry,
      name : "",
      abbreviation : "",
      active: 1,      
    } as StateFilters).subscribe((data) => {
      debugger;
      this.statesList = data.map<SelectItem>((item) => (
        {
          label: item.name,
          value: item.id
        }
      ));
    });
  }

  loadMunicipalities(){
    this.municipalitiesList = [];
    this._districtService.getDistrictList({
      IdDistrict: -1,
      idState: this.address.idState,
      status: -1,
      name : "",
      abbreviation : ""
    }).subscribe((data)=>{
      debugger;
      this.municipalitiesList = data.map<SelectItem>((item)=>(
        {
          label: item.name,
          value: item.id
        }
      ));
    });
  }

  loadCities(){
    this.citiesList = [];
    debugger;
    this._cityService.getCityList({
      idDistrict: this.address.idMunicipality,
      active: -1,
      idCity: -1,
      idCountry: -1,
      idState: -1,
      name: ""
    }).subscribe((data)=>{
      debugger;
      this.citiesList = data.map<SelectItem>((item)=>(
        {
          label: item.name,
          value: item.id
        }
      ));
    });
  }
  
}