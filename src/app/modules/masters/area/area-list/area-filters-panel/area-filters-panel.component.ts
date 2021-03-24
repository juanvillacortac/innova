import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BranchofficeService } from '../../../branchoffice/shared/services/branchoffice.service';
import { AreaFilter } from '../../shared/filters/area-filter';
import { AreaService } from '../../shared/services/area.service';

@Component({
  selector: 'app-area-filters-panel',
  templateUrl: './area-filters-panel.component.html',
  styleUrls: ['./area-filters-panel.component.scss']
})
export class AreaFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: AreaFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;

  @Output("onSearch") onSearch = new EventEmitter<AreaFilter>();
  statuslist: SelectItem[];
  BranchOfficeList : SelectItem[];
  AreaTypeList : SelectItem[];
  search() {
    this.onSearch.emit(this.filters);
  }

  constructor( private _areaService : AreaService ,private _branchofficeService: BranchofficeService) {
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
    this._branchofficeService.getBranchOfficeList()
    .subscribe((data)=>{
      this.BranchOfficeList = data.map<SelectItem>((item)=>({
        label: item.branchOfficeName,
        value: item.id
      }));
    }); 
    this._areaService.getareaTypeList()
    .subscribe((data)=>{
      this.AreaTypeList = data.map<SelectItem>((item)=>({
        label: item.name,
        value: item.id
      }));
    });   
  }

  clearFilters() {
    this.filters.name="";
    this.filters.abbreviation= "";
   this.filters.idAreaType=-1;
   this.filters.idBranchOffice=-1;
   this.filters.idFatherArea=-1;
  }

}
