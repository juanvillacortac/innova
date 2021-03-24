import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { groupingInventoryReasonFilter } from '../../shared/filter/grouping-inventory-reason-filter';

@Component({
  selector: 'grouping-inventory-reasons-filter',
  templateUrl: './grouping-inventory-reasons-filter.component.html',
  styleUrls: ['./grouping-inventory-reasons-filter.component.scss']
})
export class GroupingInventoryReasonsFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : groupingInventoryReasonFilter;
  @Input("loading") loading : boolean = false;


  statuslist: SelectItem[];

  @Output("onSearch") onSearch = new EventEmitter<groupingInventoryReasonFilter>();
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
    this.filters.name="";
  }

}
