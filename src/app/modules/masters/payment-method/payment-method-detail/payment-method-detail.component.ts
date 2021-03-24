import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { PaymentMethod, PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodGroup } from 'src/app/models/masters/payment-method-group';
import { CoinsService } from '../../coin/shared/service/coins.service';
import { PaymentMethodService } from '../shared/services/payment-method.service';

@Component({
  selector: 'app-payment-method-detail',
  templateUrl: './payment-method-detail.component.html',
  styleUrls: ['./payment-method-detail.component.scss']
})
export class PaymentMethodDetailComponent implements OnInit {

  paymentMethodGroups: SelectItem<PaymentMethodGroup[]> = {value: null};
  currencies: Coins[] = null;
  status: SelectItem[] = [
    {label: 'INACTIVO', value: 2},
    {label: 'ACTIVO', value: 1}
  ];

  formTitle: string;
  isAdded = false;
  isEdit = false;
  selectedPaymentMethodGroupId: PaymentMethodGroup;
  selectedCurrencies: Coins[];
  active: number;

  @Output() public onHideDialogForm: EventEmitter<boolean> = new EventEmitter();
  @Input() paymentMethod: PaymentMethod;


  constructor(private paymentMethodService: PaymentMethodService, private currencyService: CoinsService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.active = null;
    this.selectedPaymentMethodGroupId = null;
    this.selectedCurrencies = null;

    this.getCurrencies();
    this.getPaymentMethodGroups();

    if (this.paymentMethod && this.paymentMethod.id > 0) {
      this.formTitle = 'Editar forma de pago';
      this.active = this.paymentMethod.active ? 1 : 2;
      this.isEdit = true;
    } else {
      this.formTitle = 'Nueva forma de pago';
      this.isEdit = false;
      this.active = 1;
    }
  }

  getPaymentMethodGroups = () => {
    return  this.paymentMethodService.getPaymentMethodGroups().subscribe((data: PaymentMethodGroup[]) => {
      this.paymentMethodGroups.value = data;
      if (this.paymentMethod.paymentMethodGroup) {
        this.selectedPaymentMethodGroupId = data.find(x => x.name === this.paymentMethod.paymentMethodGroup);
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los grupos de formas de pago' });
    });
  }

  getCurrencies = () => {
    return  this.currencyService.getCoinsList().subscribe((data: Coins[]) => {
      this.currencies = data;
      if (this.paymentMethod.currenciesNames) {
        const currenciesArray = this.paymentMethod.currenciesNames.split(',');
        const currenciesToSelect = [];
        for (let i = 0; i < currenciesArray.length; i++) {
          currenciesToSelect.push(data.find(x => x.name === currenciesArray[i]));
        }
        this.selectedCurrencies = currenciesToSelect as Coins[];
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: 'Ha ocurrido un error al cargar los grupos de formas de pago' });
    });

  }

  onSave() {
    this.paymentMethod.paymentMethodGroupId = this.selectedPaymentMethodGroupId.id;
    this.paymentMethod.active = this.active === 2 ? false : true;
    this.paymentMethod.currencies = this.selectedCurrencies;

    this.paymentMethodService.savePaymentMethod(this.paymentMethod).subscribe((result: number) => {
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Guardado exitoso'});
      this.onEmitHideForm(true);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({key: 'paymentMethod', severity: 'error', summary: 'Error',
      detail: error.error.message});
    });
  }

  paymentMethodIsValid() {
    return (this.paymentMethod.name && this.paymentMethod.name.length > 0) && (this.active >= 1 && this.active <= 2) &&
    this.selectedPaymentMethodGroupId;
  }

  public onEmitHideForm(reload: boolean): void {
    this.onHideDialogForm.emit(reload);
}

}
