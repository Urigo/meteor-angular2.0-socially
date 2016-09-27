import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meteor } from 'meteor/meteor';

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
      location: ['', Validators.required],
      public: [false]
    });
  }

  addParty(): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a party');
      return;
    }

    if (this.addForm.valid) {
      Parties.insert({
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        location: {
          name: this.addForm.value.location
        },
        public: this.addForm.value.public,
        owner: Meteor.userId()
      });

      this.addForm.reset();
    }
  }
}
