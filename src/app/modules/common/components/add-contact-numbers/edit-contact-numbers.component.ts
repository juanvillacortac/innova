import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { CommonMastersService } from 'src/app/modules/masters/shared/services/common-masters.service';

@Component({
  selector: 'app-edit-contact-numbers',
  templateUrl: './edit-contact-numbers.component.html',
  styleUrls: ['./edit-contact-numbers.component.scss']
})
export class EditContactNumbersComponent implements OnInit {
  
  identifierToEdit: number = -1;

  constructor(private commonService: CommonMastersService, private countryService: CountryService) { }

  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{contactNumber: ContactNumber, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  
  contactNumberType: SelectItem[];
  countryCodeList: SelectItem[];
  codeAreaList: SelectItem[];
  submitted = false;
  contactNumber: ContactNumber = new ContactNumber();

  form: FormGroup;

  submit() {
    this.contactNumber.type = this.contactNumberType.find(x=>x.value == this.contactNumber.idType).label;
    this.contactNumber.areaCode = Number(this.codeAreaList.find(x=>x.value == this.contactNumber.idCountry).label);
    this.contactNumber.number = String(this.contactNumber.number);
    this.visible = false;
    this.submitted = true;
    this.onSubmit.emit({
      contactNumber: this.contactNumber,
      identifier: this.identifierToEdit
    });           
    this.emitVisible();
  }

  ngOnInit(): void {
    this.initForm();

    this.commonService.getContactNumberTypes({
      id: -1
    }).subscribe((data)=>{
      this.contactNumberType = data.filter(x=>x.id != 0).map((item)=>({
        label: item.name,
        value: item.id
      }));
    });

    this.countryService.getCountriesList({
      active: -1,
      idCountry: -1,
      name:"",
      abbreviation:""
    }).subscribe((data)=>{
      this.countryCodeList = data.filter(x=>x.id != 0).map((item)=>({
        label: `${item.name} (+${item.areaCode})`,
        value: item.id
      }));
      this.codeAreaList = data.filter(x=>x.id != 0).map((item)=>({
        label: `${item.areaCode}`,
        value: item.id
      }));
    });
  }

  initForm(){
    this.form = new FormGroup({
      number: new FormControl(this.contactNumber.number, [
        Validators.required,
        Validators.minLength(10)
      ]),
      type: new FormControl(this.contactNumber.idType, [
        Validators.required
      ]),
      idCountry: new FormControl(this.contactNumber.idCountry, [
        Validators.required
      ])
    });
  }

  onShow(){
    this.emitVisible();
    this.ngOnInit();
  }

  onHide(){
    this.emitVisible();
    this.contactNumber = new ContactNumber(); 
    this.identifierToEdit = -1;
  }

  emitVisible(){
    this.onToggle.emit(this.visible);
  }

  edit(contactNumber: ContactNumber, identifier: number){
    this.contactNumber = Object.assign({},contactNumber);
    this.identifierToEdit = identifier;
    this.visible = true;
  }
}
