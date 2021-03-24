import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { PortFilter } from '../../shared/filters/port-filter';
import { SelectItem } from 'primeng/api';
import { CountryService } from '../../../country/shared/services/country.service';



@Component({
  selector: 'app-ports-filters-panel',
  templateUrl: './ports-filters-panel.component.html',
  styleUrls: ['./ports-filters-panel.component.scss']
})
export class PortsFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: PortFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  //@Input() idRoleType: number;
 
  @Output("onSearch") onSearch = new EventEmitter<PortFilter>();

  countriesFilters: PortFilter   = new PortFilter();

  countriesList : SelectItem[];
  statuslist: SelectItem[];
  search() {
    this.onSearch.emit(this.filters);
  }
  constructor(private _countriesService :CountryService) { 
    
    this.statuslist=[
    { label: 'Todos', value: -1 },
    { label: 'Activos', value: 1},
    { label: 'Inactivos', value: 0}
    ];

  }

  ngOnInit(): void {
    this.loadFilters()
  }
  loadFilters(){
    this._countriesService.getCountriesList()
    .subscribe((data)=>{
      this.countriesList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });   
  }
  clearFilters() {
    this.filters.Abbreviation="";
    this.filters.Active= -1;
   this.filters.Name="";
   this.filters.IdCountry=-1;
  }

}
