import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Parties } from '../../../../both/collections/parties.collection';

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
      name: ['', Validators.required],
      description: [],
      location: ['', Validators.required]
    });
  }

  addParty(): void {
    if (this.addForm.valid) {
      Parties.insert(this.addForm.value);

      this.addForm.reset();
    }
  }
}
