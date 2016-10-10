import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DemoDataService } from './demo-data.service';
import { Demo } from "../../../../both/models/demo.model";
import template from './demo.component.html';
import style from "./demo.component.scss";

@Component({
  selector: 'demo',
  template,
  styles: [ style ]
})
export class DemoComponent implements OnInit {
  greeting: string;
  data: Observable<Demo[]>;

  constructor(private demoDataService: DemoDataService) {
    this.greeting = 'Hello Demo Component!';
  }

  ngOnInit() {
    this.data = this.demoDataService.getData().zone();
  }
}
