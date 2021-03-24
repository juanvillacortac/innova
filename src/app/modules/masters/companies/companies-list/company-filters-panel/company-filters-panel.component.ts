import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { CompanyType } from 'src/app/models/masters/company-type';
import {SelectItem} from 'primeng/api';
import { CompaniesFilter } from '../../shared/filters/companies-filter';
import { CompanyService } from '../../shared/services/company.service';

@Component({
  selector: 'filters-panel',
  templateUrl: './company-filters-panel.component.html',
  styleUrls: ['./company-filters-panel.component.scss']
})
export class CompanyFiltersPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : CompaniesFilter;
  @Input("loading") loading : boolean = false;

  companyTypes : SelectItem[];
  companyClassifications : SelectItem[];
  statuslist: SelectItem[];

  @Output("onSearch") onSearch = new EventEmitter<CompaniesFilter>();

  constructor(private companyService: CompanyService) { 
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
    this.companyService.getCompanyTypesList()
    .subscribe((data)=>{
      this.companyTypes = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
    
    this.companyService.getCompanyClassificationList()
    .subscribe((data)=>{
      this.companyClassifications = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.NIT="";
    this.filters.active=-1;
    this.filters.idClassification=-1;
    this.filters.idCompany=-1;
    this.filters.idGroup=-1;
    this.filters.idType=-1;
    this.filters.identification="";
    this.filters.socialName="";
  }
}
