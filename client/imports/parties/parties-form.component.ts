import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';

import template from './parties-form.component.html';

@Component({
  selector: 'parties-form',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class PartiesFormComponent implements OnInit {
  addForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [],
      location: ['', Validators.required]
    });
  }
}
