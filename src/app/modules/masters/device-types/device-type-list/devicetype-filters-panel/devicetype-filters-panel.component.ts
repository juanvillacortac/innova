import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DeviceTypeFilter } from '../../shared/filters/device-type-filter';

@Component({
  selector: 'app-devicetype-filters-panel',
  templateUrl: './devicetype-filters-panel.component.html',
  styleUrls: ['./devicetype-filters-panel.component.scss']
})
export class DevicetypeFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: DeviceTypeFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  //@Input() idRoleType: number;

  @Output("onSearch") onSearch = new EventEmitter<DeviceTypeFilter>();
  statuslist: SelectItem[];
  search() {
    this.onSearch.emit(this.filters);
  }
  constructor() { 
    this.statuslist=[
      { label: 'Todos', value: -1 },
      { label: 'Activos', value: 1},
      { label: 'Inactivos', value: 0}
      ];
  }

  ngOnInit(): void {
    
  }

  clearFilters() {
    this.filters.Abbreviation="";
    this.filters.Active= -1;
    this.filters.Name="";
    //Limpia los filtros
  }

}
