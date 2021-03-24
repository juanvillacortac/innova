import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { duration } from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Complementary } from 'src/app/models/products/complementary';
import { Description } from '../../../models/products/decription';
import { Durability } from '../../../models/products/durability';
import { ComplementaryFilter } from '../shared/filters/complementary-filter';
import { ComplementaryService } from '../shared/services/complementaryservice/complementary.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'product-complementary',
  templateUrl: './product-complementary.component.html',
  styleUrls: ['./product-complementary.component.scss'],
  providers: [DatePipe]
})
export class ProductComplementaryComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  _showdialogdescriptions: boolean = false;
  _showdialogdurability: boolean = false;
  _durability: Durability = new Durability();
  _description: Description = new Description();
  _durabilityListTemp: Durability[] = [];
  _descriptionListTemp: Description[] = [];

  _durabilityListTempBD: Durability[] = [];
  _descriptionListTempBD: Description[] = [];
  @Output("refreshchanges") refreshchanges = new EventEmitter<number>();
  @Output("clearchanges") clearchanges = new EventEmitter<number>();
  permissionsIDs = {...Permissions};
  
  displayedColumnsdurability: ColumnD<Durability>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.temperature; },field: 'temperature', header: 'Temperatura', display: 'table-cell'},
   {template: (data) => { return data.measurementUnit.name; },field: 'measurementUnit.name', header: 'Unidad de medida', display: 'table-cell'},
   {template: (data) => { return data.ambient.name; },field: 'ambient.name', header: 'Ambiente', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.duration; },field: 'duraction', header: 'Duración', display: 'table-cell'},
   {template: (data) => { return this.datepipe.transform(data.createdDate, "dd/MM/yyyy"); },field: 'createdDate', header: 'Fecha creado', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return this.datepipe.transform(data.updateDate, "dd/MM/yyyy"); },field: 'updateDate', header: 'Fecha actualizado', display: 'table-cell'},
   {template: (data) => { return data.updateByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  displayedColumnsDescription: ColumnD<Description>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.country.name; },field: 'country.name', header: 'País', display: 'table-cell'},
   {template: (data) => { return data.descriptionType.name; },field: 'descriptionType.name', header: 'Tipo', display: 'table-cell'},
   {template: (data) => { return data.description; },field: 'description', header: 'Descripción', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return this.datepipe.transform(data.createdDate, "dd/MM/yyyy"); },field: 'createdDate', header: 'Fecha creado', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return this.datepipe.transform(data.updateDate, "dd/MM/yyyy"); },field: 'updateDate', header: 'Fecha actualizado', display: 'table-cell'},
   {template: (data) => { return data.updateByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(private router: Router,
    private _complementaryservice: ComplementaryService,
    private messageService: MessageService,
    public datepipe: DatePipe,
    public confirmationService: ConfirmationService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    this.onLoadDurationsandDescriptionsList();
  }

  showDialogDescriptions(){
    this._description = new Description();
    this._showdialogdescriptions = true;
    
  }

  showDialogDurability(){
    this._durability = new Durability();
    this._durability.edit = false;
    this._showdialogdurability = true;
    
  }

  onEditDurability(durability: Durability){
    var _durability = new Durability();
    _durability.id = durability.id;
    _durability.idProductDurability = durability.idProductDurability;
    _durability.idDurability = durability.idDurability;
    _durability.measurementUnitId = durability.measurementUnitId;
    _durability.idAmbient = durability.idAmbient;
    _durability.temperature = durability.temperature;
    _durability.duration = durability.duration;
    _durability.createdByUser = durability.createdByUser;
    _durability.createdDate = durability.createdDate;
    _durability.updateByUser = durability.updateByUser;
    _durability.updateDate = durability.updateDate;
    _durability.active = durability.active;
    _durability.edit = true;
    this._durability = _durability;
    this._showdialogdurability = true;
  }

  back = () => {
    this._durabilityListTempBD = this._durabilityListTemp.filter(x => x.idDurability == undefined);
    this._descriptionListTempBD = this._descriptionListTempBD.filter(x => x.idDescription == undefined)
    if (this._durabilityListTemp.length != this._durabilityListTempBD.length) {
      this.ConfirmBack();
    }else if(this._descriptionListTemp.length != this._descriptionListTempBD.length){
      this.ConfirmBack();
    }else{
      this.router.navigate(['productcatalog-list']);
    }
    
  }

  ConfirmBack(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Si regresa al catalogo de los productos, todos los cambios pendientes por guardar seran eliminados.',
      accept: () => {
        this.router.navigate(['productcatalog-list']);
      },
      reject: (type) => {
      }
    })
  }
  onRemoveDurability(idDurability){
    this._durabilityListTemp = this._durabilityListTemp.filter(x => x.idDurability != idDurability);
  }

  async onLoadDurationsandDescriptionsList(){
    var filter: ComplementaryFilter = new ComplementaryFilter()
    filter.productId = this.idproduct;
    this._complementaryservice.getComplementary(filter)
    .subscribe((data)=>{
        var dat: any = data;
        this._descriptionListTemp = dat.description.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this._durabilityListTemp = dat.durabilitys.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this._descriptionListTempBD = data.description;
        this._durabilityListTempBD = data.durabilitys;
    },(error)=>{
      console.log(error);
    });
  }
  saveComplentarySection(){
    var complementarysection = new Complementary();
    complementarysection.description = this._descriptionListTemp;
    complementarysection.durabilitys = this._durabilityListTemp;
    this._complementaryservice.postComplementary(complementarysection,this.idproduct).subscribe((data: number) => {
      if(data > 0) {
        this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
        this.clearchanges.emit();
        this.onLoadDurationsandDescriptionsList();
      }else if(data == -1){
        this.messageService.add({severity:'error', summary:'Error', detail: "Registros duplicados"});
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar las durabilidades y las descripciones"});
      }
    })
  }

  onEditDescription(description: Description){
    var _des = new Description();
    _des.id = description.id;
    _des.idDescription = description.idDescription;
    _des.countryId = description.countryId;
    _des.descriptionTypeId = description.descriptionTypeId;
    _des.description = description.description;
    _des.createdByUser = description.createdByUser;
    _des.createdDate = description.createdDate;
    _des.updateByUser = description.updateByUser;
    _des.updateDate = description.updateDate;
    _des.active = description.active;
    _des.edit = true;
    this._description = _des;
    this._showdialogdescriptions = true;
  }

  onRemoveDescription(idDescription){
    this._descriptionListTemp = this._descriptionListTemp.filter(x => x.idDescription != idDescription);
  }

  refreshchange(){
    this.refreshchanges.emit();
  }
}
