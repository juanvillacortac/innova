import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Bank } from 'src/app/models/masters/bank';
import { BankType } from 'src/app/models/masters/bank-type';
import { Country } from 'src/app/models/masters/country';
import { CountryFilter } from '../../country/shared/filters/country-filter';
import { CountryService } from '../../country/shared/services/country.service';
import { BankService } from '../shared/services/bank.service';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit {

  formTitle: string;
  isEdit = false;
  bankActive: number;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() bank: Bank;

  countries: SelectItem<Country[]> = {value: null};
  bankTypes: SelectItem<BankType[]> = {value: null};

  selectedCountry: Country;
  selectedBankType: BankType;

  status: SelectItem[] = [
    {label: 'INACTIVO', value: 2},
    {label: 'ACTIVO', value: 1}
  ];

  constructor(private bankService: BankService, private countryService: CountryService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getCountries();
    this.getBankTypes();

    if (this.bank && this.bank.id > 0) {
      this.formTitle = 'Editar banco';
      this.bankActive = this.bank.active === 0 ? 2 : 1;
      this.isEdit = true;
    } else {
      this.formTitle = 'Nuevo banco';
      this.isEdit = false;
      this.bankActive = 1;
    }

    console.log(this.bank);

  }

  selectImage(base64Image) {
    this.bank.binaryImage = base64Image;
  }

  getCountries = () => {
    return  this.countryService.getCountriesList({ idCountry: -1, active: 1 } as CountryFilter).subscribe((data: Country[]) => {
      this.countries.value = data;
      if (this.bank.country) {
          this.selectedCountry = data.find(x => x.name === this.bank.country);
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los paises' });
    });

  }

  getBankTypes = () => {
    return  this.bankService.getBankTypes().subscribe((data: BankType[]) => {
      this.bankTypes.value = data;

      if (this.bank.bankType) {
        this.selectedBankType = data.find(x => x.name === this.bank.bankType);
      }

    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los tipos de bancos' });
    });
  }

  onSave() {
    this.bank.bankTypeId = this.selectedBankType.id;
    this.bank.countryId = this.selectedCountry.id;
    this.bank.active = this.bankActive === 2 ? 0 : 1;

    console.log(this.bank.binaryImage);

    this.bankService.saveBank(this.bank).subscribe((result: number) => {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso'});
      this.onEmitHideForm(true);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({key: 'bank', severity: 'error', summary: 'Error',
      detail: error.error.message});
    });
  }

  bankIsValid() {
    return (this.bank.name && this.bank.name.length > 0) && (this.bankActive >= 1 && this.bankActive <= 2) &&
    this.selectedCountry && this.selectedBankType &&
    (this.bank.sudebanCode && this.bank.sudebanCode.length > 0) &&
    (this.bank.swiftCode && this.bank.swiftCode.length > 0);
  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideDialogForm.emit(reload);
}

}
