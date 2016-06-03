import 'reflect-metadata';
import { Component } from '@angular/core';
import { FormBuilder, ControlGroup, Validators, Control } from '@angular/common';
import { Parties } from '../../../collections/parties.ts';
import { PartiesUpload } from '../parties-upload/parties-upload';
import { Meteor } from 'meteor/meteor';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import template from './parties-form.html';

@Component({
  selector: 'parties-form',
  template,
  directives: [ MATERIAL_DIRECTIVES, MdCheckbox, MD_INPUT_DIRECTIVES, PartiesUpload ]
})
export class PartiesForm {
  partiesForm: ControlGroup;

  constructor() {
    let fb = new FormBuilder();

    this.partiesForm = fb.group({
      name: ['', Validators.required],
      description: [''],
      location: ['', Validators.required],
      'public': [false]
    });
  }

  addParty(party) {
    if (this.partiesForm.valid) {
      if (Meteor.userId()) {
        Parties.insert(<Party>{
          name: party.name,
          description: party.description,
          location: {
            name: party.location
          },
          'public': party.public,
          owner: Meteor.userId()
        });

        (<Control>this.partiesForm.controls['name']).updateValue('');
        (<Control>this.partiesForm.controls['description']).updateValue('');
        (<Control>this.partiesForm.controls['location']).updateValue('');
        (<Control>this.partiesForm.controls['public']).updateValue(false);
      } else {
        alert('Please log in to add a party');
      }
    }
  }
}
