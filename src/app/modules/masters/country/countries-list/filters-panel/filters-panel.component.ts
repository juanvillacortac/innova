
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CountryFilter } from '../../shared/filters/country-filter';
import { SelectItem } from 'primeng/api';
import { CountryService } from '../../shared/services/country.service';

@Component({
  selector: 'app-filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponentCountries implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: CountryFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  //@Input() idRoleType: number;
 
  @Output("onSearch") onSearch = new EventEmitter<CountryFilter>();

  countriesFilters: CountryFilter = new CountryFilter();
  
  statuslist: SelectItem[];

  constructor() {
    this.statuslist=[
      { label: 'Todos', value: -1 },
    { label: 'Activos', value: 1},
    { label: 'Inactivos', value: 0}
    ];
  }

  ngOnInit(): void {
  }

  search() {
    this.onSearch.emit(this.filters);
  }
  
  clearFilters() {
    this.filters.abbreviation="";
    this.filters.idCountry=-1;
    this.filters.name="";
    this.filters.active= -1;
   
  }
}
