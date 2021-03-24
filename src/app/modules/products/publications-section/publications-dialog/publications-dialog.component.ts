import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DescriptionType } from 'src/app/models/masters-mpc/description-type'
import { MessageService, SelectItem } from 'primeng/api';
import { PublicationService } from  '../../shared/services/publicationservice/publication.service';
import { Validations } from '../../../masters-mpc/shared/Utils/Validations/Validations';
import { Publication } from 'src/app/models/products/publication';
import { InsertTypeFilter } from 'src/app/modules/masters-mpc/shared/filters/insert-type-filter';
import { InsertTypeService } from 'src/app/modules/masters-mpc/shared/services/InsertTypeService/insert-type.service';
import { PublicationFilter } from '../../shared/filters/publication-filter';

@Component({
  selector: 'publications-dialog',
  templateUrl: './publications-dialog.component.html',
  styleUrls: ['./publications-dialog.component.scss']
})
export class PublicationsDialogComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input("_publication") _publication: Publication;
  // @Input("_publicationId") _publicationId: num;
  @Input("filters") filters: PublicationFilter;
  @Input("_publicationId") _publicationId: PublicationFilter;
  @Input("idproduct") idproduct: number= 0;
  status: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  submitted: boolean;
  refreshclassification: Publication;
_validations: Validations = new Validations();

inserttypelist: SelectItem[];

  @Output() showDialogChange = new EventEmitter<boolean>();

  constructor(private _publicationservice: PublicationService, private messageService: MessageService,
    private _inserttypeservice: InsertTypeService) { }
  //private readonly USER_STATE = '_USER_STATE';
  ngOnInit(): void {
    if(this._publication.id == 0 || this._publication.id == -1)
         this._publication.active = true;
    
    this.onLoadPublication();
    this.onLoadInserttype();
  }

  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this._publication = new Publication();
    this._publication.active = true;
    this._publicationId = new PublicationFilter();
  }

  savePublication(): void {
    this.submitted = true;
    if (this._publication.name.trim() && this._publication.page >=1) {
      this._publication.id == 0 ? -1 : this._publication.id;
      this._publication.name = this._publication.name.trim();
       this._publication.name = this._publication.name.charAt(0).toLocaleUpperCase() + this._publication.name.substr(1).toLowerCase();

          this._publicationservice.postPublications(this._publication, parseInt(this.idproduct.toString())).subscribe((data: number) => {
            if (data > 0) {
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
              this.showDialog = false;
              this.showDialogChange.emit(this.showDialog);
              this._publication = new Publication();
              this._publication.name = "";
              this._publication.active = true;
              this._publicationservice.getPublications(this.filters).subscribe((data: Publication[]) => {
                this._publicationservice._publicationList = data;

              });
              this.submitted = false;    
            }else if (data == -2){
              console.log(data);
              this.messageService.add({severity:'error', summary:'Alerta', detail: "La combinación de tipo encarte y publicación ya existen para este producto."});
           
            }else{
              console.log(data);
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la publicación."});
            }
          }, (error: HttpErrorResponse)=>{
            
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la publicación."});
        });
    }
}
onLoadPublication() {
    if (this._publicationId.id != -1) {
        //this.filters.id=this.idproduct;
        this._publicationservice.getPublications(this._publicationId).subscribe((data: Publication[]) => {
        this._publication = data[0];
        this._publication.active = this._publication.active == true ? true : false;
      })
    }
  }

  onLoadInserttype(){
    var filter: InsertTypeFilter = new InsertTypeFilter()
    filter.active = 1;
    this._inserttypeservice.getInsertTypebyfilter(filter)
    .subscribe((data)=>{
      data=data.sort((a, b) => a.name.localeCompare(b.name));
      this.inserttypelist = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }
   
}
