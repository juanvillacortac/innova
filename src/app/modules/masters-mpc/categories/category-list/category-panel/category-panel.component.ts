import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryService } from '../../../shared/services/CategoryService/category.service';
import { CategoryFilter } from '../../../shared/filters/category-filter';
import { Validations } from '../../../shared/Utils/Validations/Validations';

@Component({
  selector: 'category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss']
})
export class CategoryPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("_category") _category : Category;
  @Input("CategoryParent") CategoryParent : Category;
  @Input("showCategoryP") showCategoryP : boolean = false;
  @Output() showCategoryPChange = new EventEmitter<boolean>();
  status: SelectItem[] = [
    {label: 'Activo', value: true},
    {label: 'Inactivo', value: false},
  ];
  loading : boolean = false;
  submitted: boolean;
  categoryfilter: CategoryFilter;
  refreshList: CategoryFilter;
  _validations: Validations = new Validations();
  constructor(private _categoryservice: CategoryService, private messageService: MessageService) { }

  ngOnInit(): void {
    this._category.active = true;
  }

  clearModel(){
    this._category.id = 0;
    this._category.name = "";
    this._category.active = true;
    this._category.idParentCategory = 0;
    this.showCategoryP = false;
    this.showCategoryPChange.emit(this.showCategoryP);
    this.CategoryParent.id = 0;
    this.CategoryParent.name = "";
    this.submitted = false;
  }
  saveCategory(){
    this.submitted = true;
    if(this._category.name.trim()){
      if(this._category.active && !this._category.validateInactivateChild || !this._category.active && !this._category.validateInactivateFather){
          this._category.id = this._category.id == 0 ? -1 : this._category.id;
          this._category.idParentCategory = this.CategoryParent.id == 0 ? this._category.idParentCategory : this.CategoryParent.id;
          this._category.name = this._category.name.trim();
          this._category.name = this._category.name.charAt(0).toLocaleUpperCase() + this._category.name.substr(1).toLowerCase();
          this._categoryservice.postCategory(this._category).subscribe((data: number) => {
            if(data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this._category.id = -1;
              this._category.name = "";
              this._category.active = true;
              this._category.idParentCategory = 0;
              this.submitted = false;
              this.showCategoryP = false;
              this.showCategoryPChange.emit(this.showCategoryP);
              this.CategoryParent.id = 0;
              this.CategoryParent.name = "";
              
              this._categoryservice.gettreeCategory(this.refreshList).subscribe((data: Category[]) => {
                this._categoryservice._categoryList = data;
              });
            }else if(data == -1){
              this.messageService.add({severity:'error', summary:'Alerta', detail: "Esta categoría ya existe"});
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la categoría"});
            }
          }, (error: HttpErrorResponse)=>{
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la categoría"});
          });
      }else{
        if(this._category.active){
          this.messageService.add({severity:'error', summary:'Error', detail: "Active la categoría superior para activar esta subcategoría"});
        }else if(!this._category.active){
          this.messageService.add({severity:'error', summary:'Error', detail: "La categoría tiene subcategorías activas"});
        }
      }
    }
  }
}
