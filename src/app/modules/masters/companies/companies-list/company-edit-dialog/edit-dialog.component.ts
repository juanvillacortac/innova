import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Company } from 'src/app/models/masters/company';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { DocumentTypes } from 'src/app/models/masters/document-type';
import { EditContactNumbersComponent } from 'src/app/modules/common/components/add-contact-numbers/edit-contact-numbers.component';
import { EditAddressComponent } from 'src/app/modules/common/components/edit-address/edit-address.component';
import { CountryService } from '../../../country/shared/services/country.service';
import { DocumentTypeService } from '../../../document-types/shared/services/document-type.service';
import { CompaniesFilter } from '../../shared/filters/companies-filter';
import { CompanyService } from '../../shared/services/company.service';
import {Validations} from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { DocumentTypeFilter } from 'src/app/models/masters/document-type-filters';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})

export class EditDialogComponent implements OnInit {
  disabled : boolean = true;
  @Input("showDialog") showDialog: boolean = true;
  @Input("_Datacompany") _Datacompany: Company ;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Input("filters") filters: CompaniesFilter;

  @ViewChild(EditContactNumbersComponent) contactDialog: EditContactNumbersComponent;
  @ViewChild(EditAddressComponent) addressDialog: EditAddressComponent;
  _validations : Validations = new Validations();
  contactNumberDialogVisible = false;
  addressDialogVisible = false;
  visible = false;
  selectedPhoneIndex: number = -1;
  selectedAddressIndex: number = -1;
  @Input("companyId") companyId: number = -1;
  submitted: boolean;
  public _company: Company;
  menuItemsPhone: MenuItem[] = [
      {
          label: 'Editar',
          icon: 'pi pi-fw pi-pencil',
          command: (t)=>{
            this.contactDialog.edit(this._company.contactNumbers[this.selectedPhoneIndex], this.selectedPhoneIndex);
          }
      },
      {
          label: 'Eliminar',
          icon: 'pi pi-fw pi-trash',
          command: (t)=>{
            this._company.contactNumbers.splice(this.selectedPhoneIndex,1);
          }
      }
  ];
  companyClassifications: any;
  companyTypes: SelectItem[];
  companyGroups: SelectItem<any>[];
  countries: SelectItem<any>[];
  statusList: SelectItem[];
  documentTypeList : SelectItem[];
  IdentifierTypeList : DocumentTypes[];
  identifierType : DocumentTypes;

  constructor(public _companyService: CompanyService, public _countryService: CountryService , public messageService: MessageService , public _DocumentTypeService : DocumentTypeService) {
    this.statusList=[
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];


  }

  ngOnInit(): void {
    this._company = new Company();
    this._company.id = this.companyId;

    if(this.companyId != -1)
    {
      this._companyService.getCompany(this.companyId)
      .subscribe((data)=>{
        if(data){
          this._company = data;
        }else{
          this.visible = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "No se consiguio la empresa." });
        }
      },(error) => {
        this.visible = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la empresa." });
        console.log(error);
      });
    }

    this._company.contactNumbers = [
      // {
      //   countryCode: 81,
      //   id: 1,
      //   idType: 1,
      //   number: "2",
      //   type: "Tipo"
      // }
    ];

    this._company.addresses = [
      // {
      //   buildingName: "Edificio",
      //   city: "Ciudad",
      //   country: "Pais",
      //   id:1,
      //   idCity: 1,
      //   floor: "Piso",
      //   idCountry: 1,
      //   idMunicipality: 1,
      //   idState: 1,
      //   idType: 1,
      //   municipality: "Muni",
      //   postalCode:"6301",
      //   reference: "Referencia",
      //   state: "Estado",
      //   street: "Calle",
      //   type: "Tipo"
      // }
    ];

    this._companyService.getCompanyClassificationList({
      id: -1
    }).subscribe((data)=>{
      this.companyClassifications = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }))
    });

    this._companyService.getCompanyTypesList({
      id: -1
    }).subscribe((data)=>{
      this.companyTypes = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }))
    });

    this._companyService.getCompanyGroupList({
      id: -1
    }).subscribe((data)=>{
      this.companyGroups = data.map((item)=>({
        label: item.name,
        value: item.id
      }))
    });

    this._countryService.getCountriesList({
      active: -1,
      idCountry: -1,
       name:"",
       abbreviation:"",
    }).subscribe((data)=>{
      this.countries = data.map((item)=>({
        label: item.name,
        value: item.id
      }))
    });

    if(this._company.id<=0)
    this._company.active=true;
  };


  validatePhone(contactNumber: ContactNumber, identifier: number){

    var index = this._company.contactNumbers.findIndex(x=>x.idCountry==contactNumber.idCountry && x.number == contactNumber.number);

    if(index>=0 && index==identifier || index < 0){
      return null;
    }else{
      return "El número de telefono ya se ha agregado previamente a la lista";
    }
  }

  menuItemsAddress: MenuItem[] = [
    {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: (t)=>{
          this.addressDialog.edit(this._company.addresses[this.selectedAddressIndex], this.selectedAddressIndex);
        }
    },
    {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: (t)=>{
          this._company.addresses.splice(this.selectedAddressIndex,1);
        }
    }
  ];

  showPhoneMenu(event: Event, menu: Menu, index: number){
    this.selectedPhoneIndex = index;
    menu.toggle(event);
  }

  showAddressMenu(event: Event, menu: Menu, index: number){
    this.selectedAddressIndex = index;
    menu.toggle(event);
  }

  onSubmitContactNumber(data){
    if(data.identifier == -1)
      data.contactNumber.id = -1;

    var error = this.validatePhone(data.contactNumber, data.identifier);

    if(error===null){
      if(data.identifier == -1){
        this._company.contactNumbers = this._company.contactNumbers.concat(data.contactNumber);
      }else{
        this._company.contactNumbers.splice(data.identifier, 1, data.contactNumber);
      }
    }else{
        alert(error);
        this.contactDialog.edit(data.contactNumber, this.selectedPhoneIndex);
    }
  }

  onHideContacNumber(visible: boolean){
    this.contactNumberDialogVisible = visible;
  }

  onSubmitAddress(data){
    if(data.identifier == -1)
      data.address.id = -1;

    var error = null;//this.validateAddress(data.contactNumber, data.identifier);

    if(error===null){
      if(data.identifier == -1){
        this._company.addresses = this._company.addresses.concat(data.address);
      }else{
        this._company.addresses.splice(data.identifier, 1, data.address);
      }
    }else{
        alert(error);
        this.addressDialog.edit(data.address, this.selectedPhoneIndex);
    }
  }

  onToggleAddress(visible: boolean){
    this.addressDialogVisible = visible;
  }

  submit(){
    this.submitted = true;
    if (this._company.name.trim() && this._company.name != ""  &&
        this._company.socialName.trim() && this._company.socialName != "" &&
         this._company.idClassification  > 0 && this._company.idType  > 0 &&
         this._company.idGroup  > 0 && this._company.idTypeIdentification  > 0 && this._company.idCountry > 0 &&
         this._company.identification.trim() && this._company.identification != "" &&
         this._company.nit.trim() && this._company.nit != ""
      )
    {
      this._companyService.insertCompany(this._company).subscribe((data)=>{
        debugger
        if(data>0){
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
               this.showDialog = false;
               this.showDialogChange.emit(this.showDialog);
               this._company= new Company();
               this._company.active = true;
               this._companyService.getCompaniesList(this.filters = new CompaniesFilter()).subscribe((data: Company[]) => {
                this._companyService._companiesList = data;
              });

          this.submitted = false;
          this.visible=false;
        }
      },(error)=>{
        alert("Ha ocurrido un error");
      });

    }

  }


  edit(companyId: number){
    this.companyId = companyId;
    this.visible = true;
    this.ngOnInit();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._company = new Company();
    this._company.id = -1;
    this._company.active = true;
  }

  onLoadDocumentType(idCountry : number)
  {
     let filters= new DocumentTypeFilter();
     filters.idCountry = idCountry;
    this._DocumentTypeService.getdocumentTypeList(filters).subscribe((data)=>{
      this.IdentifierTypeList = data;
      this.documentTypeList = data.map((item)=>({
        label: item.identifier + "-" + item.name,
        value: item.id
      }))

    });
  }

  onValidateDocumentInput(event)
  {
    debugger

    if(this.IdentifierTypeList)
    {
      this.identifierType =  this.IdentifierTypeList.find(x=>x.id === this._company.idTypeIdentification);
      console.log(this.identifierType.active);
      if(this.identifierType.indAlphanumeric == true){
        var inp = String.fromCharCode(event.keyCode);
        if (/^[a-zA-Z0-9]*$/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }

      }else
      {
        var inp = String.fromCharCode(event.keyCode);
        if (/^[0-9]*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
      }

    }else
    {
      //this.disabled =true;
      this.onClearIndetifier();
      return null
    }

  }

  onClearIndetifier()
  {
    if(this.IdentifierTypeList)
    {
      this.disabled = false;
      this._company.identification = "";
    }else
    {
      this._company.identification = "";
      this.disabled = true;
    }

  }
}
