import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-label',
  templateUrl: './active-label.component.html',
  styleUrls: ['./active-label.component.scss']
})
export class ActiveLabelComponent implements OnInit {

  @Input() active: boolean;
   
  constructor() { }

  ngOnInit(): void {
  }

}
