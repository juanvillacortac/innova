import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PriceGroupingFilter } from '../../shared/filters/pricegrouping-filter';

@Component({
  selector: 'app-price-grouping-filters-panel',
  templateUrl: './price-grouping-filters-panel.component.html',
  styleUrls: ['./price-grouping-filters-panel.component.scss']
})
export class PriceGroupingFiltersPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : PriceGroupingFilter;
  @Input("loading") loading : boolean = false;


  statuslist: SelectItem[];

  @Output("onSearch") onSearch = new EventEmitter<PriceGroupingFilter>();
  constructor() {
    this.statuslist=[
      { label: 'Todos', value: -1 },
      { label: 'Activos', value: 1},
      { label: 'Inactivos', value: 0}
      ];
   }

  ngOnInit(): void {
  }
  
  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.active=-1;
    this.filters.id=-1;
    this.filters.abbreviation="";
    this.filters.name="";
  }
}
