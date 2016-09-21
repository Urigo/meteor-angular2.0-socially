import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import template from './parties-form.component.html';

@Component({
  selector: 'parties-form',
  template
})
export class PartiesFormComponent implements OnInit {
  addForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: [],
      description: [],
      location: []
    });
  }
}
