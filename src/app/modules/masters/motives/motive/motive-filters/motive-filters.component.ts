import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { App } from 'src/app/models/security/App';
import { Module } from 'src/app/models/security/Module';
import { Software } from 'src/app/models/security/Software';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { MotivesService } from '../../shared/services/motives.service';

@Component({
  selector: 'app-motive-filters',
  templateUrl: './motive-filters.component.html',
  styleUrls: ['./motive-filters.component.scss']
})
export class MotiveFiltersComponent implements OnInit {


  systems: SelectItem<Software[]> = {value: null};
  apps: SelectItem<App[]> = {value: null};
  modules: SelectItem<Module[]> = {value: null};
  motivesTypes: SelectItem<MotivesType[]> = {value: null};
  systemSelected = false;
  appSelected = false;
  moduleSelected = false;
  systemId: number;
  
  @Input() expanded : boolean = false;
    @Input("filters") filters : MotivesFilters;
    @Input("loading") loading : boolean = false;
    @Output("onSearch") onSearch = new EventEmitter<MotivesFilters>();
    status: SelectItem[] = [
      {label: 'Todos', value: '-1'},
      {label: 'Inactivo', value: '0'},
      {label: 'Activo', value: '1'}
    ];
    _validations: Validations = new Validations();
  
    constructor(
      private _securityService: SecurityService,
      private _motivesService: MotivesService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService) {  
    }
  
    ngOnInit(): void {
      this.filters.active = -1;
      this.getSystemsPromise();
    }
    onSystemSelected(system)
 {
  if(system)
  {
    this.systemSelected = true;
    this.getAppsPromise(system.id);
  }
  else
  {
    this.systemSelected = false;
    this.appSelected = false;
    this.modules = {value: null};
    this.moduleSelected = false;
    this.motivesTypes = {value: null};
    this.filters.idModule = -1
    this.filters.idMotivesType = -1
  }

 }

 onAppSelected(app){
  if(app)
  {
    this.appSelected = true;
    this.getModulePromise(app.id);
  }
  else
  {
    this.appSelected = false;
    this.modules = {value: null};
    this.moduleSelected = false;
    this.motivesTypes = {value: null};
    this.filters.idModule = -1
    this.filters.idMotivesType = -1
  }
 }
 
 onModuleSelected(moduleSelected){
  if(moduleSelected)
  {
    this.moduleSelected = true;
    this.getMotivesTypePromise(moduleSelected.id);
    this.filters.idModule = moduleSelected.id;
  }
  else
  {
    this.moduleSelected = false;
    this.motivesTypes = {value: null};
    this.filters.idModule = -1
    this.filters.idMotivesType = -1
  }
 }
  
 onMotiveTypeSelected(motiveType){
  if(motiveType)
  {
    this.filters.idMotivesType = motiveType.id;
  }
  else
  {
    this.filters.idMotivesType = -1
  }

 }
 getSystemsPromise = () => {
    return  this._securityService.getSystemsPromise()
    .then(results => {
      this.systems.value = results;
    }, (error) => {
      this.messageService.add({key:'motives-type',severity: 'error', summary: 'Cargar sistemas', detail: error.error.message});
      console.log(error.error.message);
    });

  }

  getAppsPromise = (idSystem : number) => {
    return  this._securityService.getAppsBySystemPromise(idSystem)
    .then(results => {
      this.apps.value = results;
    }, (error) => {
      this.messageService.add({key:'motives-type',severity: 'error', summary: 'Cargar aplicaciones', detail: error.error.message});
      console.log(error.error.message);
    });

  }

  getModulePromise = (idApp : number) => {
    return  this._securityService.getModulesByAppPromise(idApp)
    .then(results => {
      this.modules.value = results;
    }, (error) => {
      this.messageService.add({key:'motives-type',severity: 'error', summary: 'Cargar modulos', detail: error.error.message});
      console.log(error.error.message);
    });

  }


  getMotivesTypePromise = (idModule : number) => {
    let filters = new MotivesTypeFilters();
    filters.idModule = idModule;
    return  this._motivesService.getMotivesTypes(filters)
    .then(results => {
      this.motivesTypes.value = results;
    }, (error) => {
      this.messageService.add({key:'motives-type',severity: 'error', summary: 'Cargar tipos de motivos', detail: error.error.message});
      console.log(error.error.message);
    });

  }
    search(){
      this.onSearch.emit(this.filters);
    }
  
    clearFilters(){
      this.filters.id=-1;
      this.filters.name="";
      this.filters.idModule=-1;
      this.filters.active = -1;
      this.filters.idMotivesType = -1
      this.systemSelected = false;
      this.appSelected = false;
      this.apps = {value: null};
      this.modules = {value: null};
      this.systemId = -1;
      this.moduleSelected = false;
      this.motivesTypes = {value: null};
    }



}
