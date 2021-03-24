import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { App } from 'src/app/models/security/App';
import { Module } from 'src/app/models/security/Module';
import { Software } from 'src/app/models/security/Software';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { MotivesService } from '../../shared/services/motives.service';

@Component({
  selector: 'app-motives-type-detail',
  templateUrl: './motives-type-detail.component.html',
  styleUrls: ['./motives-type-detail.component.scss']
})
export class MotivesTypeDetailComponent implements OnInit {
  motivesTypeForm: FormGroup;
  isEdit = false;
  formTitle: string;
  systemSelected = false;
  appSelected = false;
  motivesTypeAdded: boolean;
  systems: SelectItem<Software[]> = {value: null};
  apps: SelectItem<App[]> = {value: null};
  modules: SelectItem<Module[]> = {value: null};
  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() motiveType: MotivesType;
  @Input() motiveTypeList: MotivesType[];
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  _validations: Validations = new Validations();
  constructor(
    private _securityService: SecurityService,
    private _motivesService: MotivesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {  
      this.motivesTypeForm = this.setNewMotivesTypeForm();
  }
  ngOnInit(): void { 

    if(this.motiveType)
    { 
      this.formTitle="Editar tipo motivo"
      this.isEdit = true;  
      this.onEditForm();
    }
    else
    {
      this.formTitle="Nuevo tipo motivo"
      this.isEdit = false;
      this.motivesTypeForm.controls.statusValue.setValue('1');   
      this.getSystemsPromise();
    }
  }
  onEditForm(){
    this.getSystemsPromise().then(() =>{
      this.getAppsPromise(-1).then( () =>{
        this.getModulePromise(-1).then( () =>{
          let moduleSelected = this.modules.value.find(p=> p.id === this.motiveType.idModule);
            this.motivesTypeForm.patchValue({
              id: this.motiveType.id,
              name: this.motiveType.name,
              abbreviation: this.motiveType.abbreviation,
              idSystem: this.systems.value.find(p => Number(p.id) === Number(moduleSelected.idSoftware)),
              idApp: this.apps.value.find(p => Number(p.id) === Number(moduleSelected.idApp)),
              idModule: this.modules.value.find(p => Number(p.id) === Number(moduleSelected.id)),
              statusValue: this.motiveType.active ? String(StatusEnum.active) : String(StatusEnum.inactive)
            });
        });
      });
    });
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
    this.apps = {value: null};
    this.modules = {value: null};
  }

 }

 onAppSelected(app)
 {
  if(app)
  {
    this.appSelected = true;
    this.getModulePromise(app.id);
  }
  else
  {
    this.appSelected = false;
    this.modules = {value: null};
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
  toMotiveTypeModel(){
      let model = new MotivesType();

          model.id = this.motivesTypeForm.controls.id.value;
          model.name = this.motivesTypeForm.controls.name.value;
          model.abbreviation = this.motivesTypeForm.controls.abbreviation.value;
          model.idModule = this.motivesTypeForm.controls.idModule.value.id;
          model.active = this.motivesTypeForm.controls.statusValue.value === '0' ? false : true;

      return model;
  }

  onSave() {
    

    const newMotiveType = this.toMotiveTypeModel();
    if(this.isValidateMotiveType(newMotiveType))
    {
      this._motivesService.addMotiveType(newMotiveType).subscribe((data: number) => {
        if(data > 0) {
          this.messageService.add({ severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
          this.onEmitHideForm(true);     
        }else if(data == -1){
          this.messageService.add({key:'motives-type', severity:'warn', summary:'Alerta', detail: "Esta tipó de motivo ya existe"});
        }else{
          this.messageService.add({key:'motives-type', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de motivo"});
        }
      }, ()=>{
        this.messageService.add({key:'motives-type', severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar el tipo de motivo"});
      });
    }
}
  isValidateMotiveType(newMotiveType: MotivesType)
  {
      let inValidateName = this.motiveTypeList.find(p=> p.name.trim().toUpperCase() === newMotiveType.name.trim().toUpperCase() && (p.idModule === newMotiveType.idModule && p.id !== newMotiveType.id));   
      let inValidateAbbreviation = this.motiveTypeList.find(p=> p.abbreviation.trim().toUpperCase() === newMotiveType.abbreviation.trim().toUpperCase() &&  (p.idModule === newMotiveType.idModule && p.id !== newMotiveType.id));
      
      if(inValidateName)
      {
        this.messageService.add({key:'motives-type', severity:'warn', summary:'Alerta', detail: "Ya existe un tipo de motivo con ese nombre en el modulo seleccionado"});
        return false;
      }

      if(inValidateAbbreviation)
      {
        this.messageService.add({key:'motives-type', severity:'warn', summary:'Alerta', detail: "Ya existe un tipo de motivo con ese abreviatura en el modulo seleccionado"});
        return false;
      }
      
      return true;
  }

  private setNewMotivesTypeForm() {
      return this.formBuilder.group({
        id:-1,
        name: ['', Validators.required],
        abbreviation: ['', Validators.required],
        idSystem: [''],
        idApp: [''],
        idModule: ['', Validators.required],
        statusValue : ['', Validators.required]
      });
    }

  public onEmitHideForm(reload: boolean): void {
      this.onHideDialogForm.emit(reload);
  }
}
