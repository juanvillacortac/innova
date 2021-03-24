import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { ContactNumber } from 'src/app/models/masters/contact-number';
import { EditContactNumbersComponent } from 'src/app/modules/common/components/add-contact-numbers/edit-contact-numbers.component';
import { EditAddressComponent } from 'src/app/modules/common/components/edit-address/edit-address.component';
import { CompanyService } from '../../../companies/shared/services/company.service';
import { BranchofficeFilter } from '../../shared/filters/branchoffice-filter';
import { BranchofficeService } from '../../shared/services/branchoffice.service';

@Component({
  selector: 'app-branchoffices-edit-dialog',
  templateUrl: './branchoffices-edit-dialog.component.html',
  styleUrls: ['./branchoffices-edit-dialog.component.scss']
})


export class BranchofficesEditDialogComponent implements OnInit {
  
  @ViewChild(EditContactNumbersComponent) contactDialog: EditContactNumbersComponent; 
  @ViewChild(EditAddressComponent) addressDialog: EditAddressComponent; 
  visible = false;
  selectedPhoneIndex: number = -1;
  selectedAddressIndex: number = -1;
  @Input("branchOfficeId") branchOfficeId: number = -1;
  @Input("filters") filters: BranchofficeFilter;
  submitted: boolean;
  public _branchOffice: Branchoffice;
  contactNumberDialogVisible = false;
  addressDialogVisible = false;

  menuItemsPhone: MenuItem[] = [
      {
          label: 'Editar', 
          icon: 'pi pi-fw pi-pencil',
          command: (t)=>{
            this.contactDialog.edit(this._branchOffice.contactNumbers[this.selectedPhoneIndex], this.selectedPhoneIndex);
          }
      },
      {
          label: 'Eliminar', 
          icon: 'pi pi-fw pi-trash',
          command: (t)=>{
            this._branchOffice.contactNumbers.splice(this.selectedPhoneIndex,1);
          }
      }
  ];  

  menuItemsAddress: MenuItem[] = [
    {
        label: 'Editar', 
        icon: 'pi pi-fw pi-pencil',
        command: (t)=>{
          this.addressDialog.edit(this._branchOffice.addresses[this.selectedAddressIndex], this.selectedAddressIndex);
        }
    },
    {
        label: 'Eliminar', 
        icon: 'pi pi-fw pi-trash',
        command: (t)=>{
          this._branchOffice.addresses.splice(this.selectedAddressIndex,1);
        }
    }
  ];

  branchOfficeTypeList: SelectItem[];
  companyList : SelectItem[]; 
  statusList: SelectItem[];
  nationalPurchasesList: SelectItem[];
  internationalPurchasesList: SelectItem[];

  constructor(private _branchofficeService: BranchofficeService, private _companyService: CompanyService, private messageService: MessageService) { 

    this.statusList=[      
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];

    this.nationalPurchasesList=[      
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];

    this.internationalPurchasesList=[      
      { label: 'Activo', value: true},
      { label: 'Inactivo', value: false}
      ];

  }

  ngOnInit(): void {
    this._branchOffice = new Branchoffice();
    this._branchOffice.id = this.branchOfficeId;

    if(this.branchOfficeId != -1)
    {
      this._branchofficeService.getBranchOffice(this.branchOfficeId)
      .subscribe((data)=>{
        if(data){
          this._branchOffice = data;
        }else{
          this.visible = false;
          alert("No se consiguio el registro");
        }
      },(error) => {
        this.visible = false;
        alert("Ha ocurrido un error cargando la sucursal");
        console.log(error);
      });
    }

    this._branchOffice.contactNumbers = [
    ];

    this._branchOffice.addresses = [
    ];

    this._branchofficeService.getBranchOfficeTypeList({
      id: -1
    }).subscribe((data)=>{
      this.branchOfficeTypeList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeTypeName,
        value: item.id
      }))
    });

    this._companyService.getCompaniesList()
    .subscribe((data)=>{
      this.companyList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });

  }

 

  showPhoneMenu(event: Event, menu: Menu, index: number){
    this.selectedPhoneIndex = index;
    menu.toggle(event);
  }

  showAddressMenu(event: Event, menu: Menu, index: number){
    this.selectedAddressIndex = index;
    menu.toggle(event);
  }

  validatePhone(contactNumber: ContactNumber, identifier: number){
    
    var index = this._branchOffice.contactNumbers.findIndex(x=>x.idCountry==contactNumber.idCountry && x.number == contactNumber.number);

    if(index>=0 && index==identifier || index < 0){
      return null;
    }else{
      return "El número de telefono ya se ha agregado previamente a la lista";
    }
  }

  onSubmitContactNumber(data){
    if(data.identifier == -1)
      data.contactNumber.id = -1;
    
    var error = this.validatePhone(data.contactNumber, data.identifier);
    
    if(error===null){
      if(data.identifier == -1){
        this._branchOffice.contactNumbers = this._branchOffice.contactNumbers.concat(data.contactNumber);
      }else{
        this._branchOffice.contactNumbers.splice(data.identifier, 1, data.contactNumber);
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
        this._branchOffice.addresses = this._branchOffice.addresses.concat(data.address);
      }else{
        this._branchOffice.addresses.splice(data.identifier, 1, data.address);
      }
    }else{
        alert(error);
        this.addressDialog.edit(data.address, this.selectedPhoneIndex);
    }
  }

  onToggleAddress(visible: boolean){
    this.addressDialogVisible = visible;
  }

  submit()
  {
    this.submitted = true;
      if (this._branchOffice.branchOfficeName.trim()  )
      {
        this._branchOffice.id == 0 ? -1 : this._branchOffice.id;
        this._branchofficeService.postBranchOffice(this._branchOffice).subscribe((data) => {
        if (data> 0)
         {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.visible = false;
            //this.showDialogChange.emit(this.showDialog);
            this._branchOffice= new Branchoffice();
            this._branchOffice.active = true;               
            this._branchofficeService.getBranchOfficeList(this.filters = new BranchofficeFilter()).subscribe((data: Branchoffice[]) => {
              this._branchofficeService._branchOfficeList = data;
              this.submitted = false;
            });                       
          }
          // else{
          //   //if(data==0)
          //        //this.messageService.add({ severity: 'warn', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
          //    //else if(data==-1)
          //        //this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "El registro se encuentra duplicado" });
          //   //else
          //        //this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "El registro no se encuentra" });
          // //}
          // }, (error: HttpErrorResponse) => {
          //   //this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
           });
      
      }
   } 
  
  branchOfficeEdit(branchOfficeId: number){    
    this.branchOfficeId = branchOfficeId;
    this.visible = true;
    this.ngOnInit();
  }

  hideDialog(): void {
    this.visible = false;
    //this.showDialogChange.emit(this.visible);
    this.submitted = false;
    this._branchOffice = new Branchoffice();
    this._branchOffice.active = true;

  }
}
