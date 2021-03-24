import { Component,EventEmitter,Input, OnInit, Output } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { brandsFilter } from '../../shared/filters/brands-Filters';
import { BrandsService } from '../../shared/services/brands.service';


@Component({
  selector: 'app-brand-filters-panel',
  templateUrl: './brand-filters-panel.component.html',
  styleUrls: ['./brand-filters-panel.component.scss']
})
export class BrandFiltersPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : brandsFilter;
  @Input("loading") loading : boolean = false;

  BrandsClass : SelectItem[];
  statuslist:SelectItem[];

  @Output("onSearch") onSearch = new EventEmitter<brandsFilter>();

  constructor(private brandService:BrandsService) {
    this.statuslist=[
    { label: 'Todos', value: -1 },
    { label: 'Activos', value: 1},
    { label: 'Inactivos', value: 0}
    ];
   }

  ngOnInit(): void {
    this.loadFilters();
  }
  loadFilters(){
    this.brandService.getBrandsClassList()
    .subscribe((data)=>{
      this.BrandsClass = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });   
  }

  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.active=-1;
    this.filters.id=-1;
    this.filters.idClass=-1;
    this.filters.abbreviation="";
    this.filters.name="";
  }
  

}
