import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numbersOnly]'
})
export class OnlyNumberDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this.control.control.setValue(initalValue.replace(/[^0-9]*/g, ''));
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[lettersOnly]'
})
export class OnlyLettersDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this.control.control.setValue(initalValue.replace(/[^a-zA-ZÀ-ú ]/g, ''));
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  selector: '[noneSpecialCharacters]'
})
export class NoneSpecialCharactersDirective {

  constructor(private _el: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this.control.control.setValue(initalValue.replace(/[^a-zA-Z0-9À-ú ]/g, ''));
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}



