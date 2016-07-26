import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meteor } from 'meteor/meteor';

import { Parties } from '../../../both/collections/parties.collection';

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

  resetForm() {
    this.addForm.controls['name']['updateValue']('');
    this.addForm.controls['description']['updateValue']('');
    this.addForm.controls['location']['updateValue']('');
  }

  addParty() {
    if (this.addForm.valid) {
      if (Meteor.userId()) {
        Parties.insert(this.addForm.value);

        // XXX will be replaced by this.addForm.reset() in RC5+
        this.resetForm();
      } else {
        alert('Please log in to add a party');
      }
    }
  }
}
