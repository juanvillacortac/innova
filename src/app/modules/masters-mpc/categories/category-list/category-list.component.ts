import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Category } from 'src/app/models/masters-mpc/category';
import { CategoryFilter } from '../../shared/filters/category-filter';
import { CategoryService } from '../../shared/services/CategoryService/category.service';
import {MessageService, TreeNode} from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';



@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  loading : boolean = false;

  submitted: boolean;
  categorynew: boolean = false;
  categoryFilterId : CategoryFilter = new CategoryFilter();
  categoryFilters: CategoryFilter = new CategoryFilter();
  categoryViewModel: Category = new Category();
  category: Category = new Category();
  cols: any[];
  showDialog: boolean = false;
  sales: TreeNode[];
  CategoryParent: Category = new Category();
  showCategoryPanel: Boolean = false;
  permissionsIDs = {...Permissions};

  constructor(public _categoryservice: CategoryService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Categorías', routerLink: ['/category-list'] }
    ]);
   }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nombre' },
      { field: 'active', header: 'Estatus' }
      /* { field: 'type', header: 'Type' } */
    ];
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._categoryservice.gettreeCategory(this.categoryFilters).subscribe((data: Category[]) => {
      this._categoryservice._categoryList = data;
      console.log(data);
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las categorías"});
    });
  }

  AddCategory(){
    this.categorynew = !this.categorynew;
    this.showCategoryPanel = false;
  }

  AddChild(id: number, name: string){
    this.CategoryParent.id = id;
    this.CategoryParent.name = name;
    
    this.categoryViewModel = {
      id : 0,
      name : "",
      active: true,
      idParentCategory: 0,
      description: "",
      childAmount : 0,
      createdByUser: "",
      createdByUserId: 0,
      updatedByUser: "",
      initialSetup: false,
      validateInactivateFather: false,
      validateInactivateChild: false,
      validateOnlyChild: false,
    }
    this.categorynew = true;
    this.showCategoryPanel = true;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  EditChild(idCategory: number, nameCategory: string, activeCategory: boolean, idPCategory: number, validateInactivateFather: boolean, validateInactivateChild: boolean){
    this.categoryViewModel = {
      id : idCategory,
      name : nameCategory,
      active: activeCategory,
      idParentCategory: idPCategory,
      childAmount : 0,
      description: "",
      createdByUser: "",
      createdByUserId: 0,
      updatedByUser: "",
      initialSetup: false,
      validateInactivateFather: validateInactivateFather,
      validateInactivateChild: validateInactivateChild,
      validateOnlyChild: false,
    }
    this.categorynew = true;
    this.showCategoryPanel = false;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  LevelUp(id: number, idParentCategory: number){
    var category = new Category();
    var categoryFilter = new CategoryFilter();
    categoryFilter.active = 1;
    categoryFilter.idCategory = idParentCategory;
    categoryFilter.idParentCategory = -1;
    categoryFilter.idUser = -1;
    categoryFilter.name = "";
    if(idParentCategory != 0){
      this._categoryservice.getCategorys(categoryFilter).subscribe((data1: Category[]) => {
        if(data1.length == 1){
          category.id = id;
          category.idParentCategory = data1[0].idParentCategory;
          category.active = true;

          this._categoryservice.changeLevelCategory(category).subscribe((data2: number) => {
            if(data2 >= 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Categoría elevada con éxito"});
              this._categoryservice.gettreeCategory(new CategoryFilter()).subscribe((data3: Category[]) => {
                this._categoryservice._categoryList = data3;
              });
            }
          }, (error: HttpErrorResponse)=>{
            this.loading = false;
            this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las categorías"});
          });
          this._categoryservice.gettreeCategory(new CategoryFilter()).subscribe((data3: Category[]) => {
            this._categoryservice._categoryList = data3;
          });
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al subir de nivel la categoría"});
        }
      }, (error: HttpErrorResponse)=>{
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las categorías"});
      });

    }
    
  }

  LevelDown(id: number, idParentCategory: number){
    var filter = new CategoryFilter
    filter.idParentCategory = idParentCategory;
    this._categoryservice.getCategorys(filter).subscribe((data: Category[]) => {
      if(data.length >= 0) {
        this.category = new Category();
        this.category.id = id;
        this.category.idParentCategory = idParentCategory;
        this.showDialog = true;
      }else{
        this.messageService.add({severity:'error', summary:'Error', detail: "La subcategoría no posee otras subcategorías del mismo nivel"});
      }
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las categorías"});
    });
    
  }
}
