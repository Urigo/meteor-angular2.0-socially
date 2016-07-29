import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

import { Parties } from '../../../both/collections/parties.collection';

import template from './parties-form.component.html';

@Component({
  selector: 'parties-form',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES, MdCheckbox, MD_INPUT_DIRECTIVES, MD_BUTTON_DIRECTIVES]
})
export class PartiesFormComponent implements OnInit {
  addForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [],
      location: ['', Validators.required],
      public: [false]
    });
  }

  resetForm() {
    this.addForm.controls['name']['updateValue']('');
    this.addForm.controls['description']['updateValue']('');
    this.addForm.controls['location']['updateValue']('');
    this.addForm.controls['public']['updateValue'](false);
  }

  addParty() {
    if (this.addForm.valid) {
      if (Meteor.userId()) {
        Parties.insert({
          name: this.addForm.value.name,
          description: this.addForm.value.description,
          location: {
            name: this.addForm.value.location
          },
          public: this.addForm.value.public,
          owner: Meteor.userId()
        });

        // XXX will be replaced by this.addForm.reset() in RC5+
        this.resetForm();
      } else {
        alert('Please log in to add a party');
      }
    }
  }
}
