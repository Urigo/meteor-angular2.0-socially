import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { FormBuilder, ControlGroup, Validators } from '@angular/common';
import { MATERIAL_DIRECTIVES } from 'ng2-material';
import { Router , ROUTER_DIRECTIVES} from '@angular/router';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdToolbar } from '@angular2-material/toolbar';
import { Accounts } from 'meteor/accounts-base';

import template from './login.mobile.html';

@Component({
  selector: 'login',
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, MD_INPUT_DIRECTIVES, MdToolbar],
  template
})
export class Login extends MeteorComponent {
  phoneForm: ControlGroup;
  phone: string;
  error: string;

  constructor(private router: Router) {
    super();

    this.phoneForm = new FormBuilder().group({
      phone: ['', Validators.required]
    });

    this.error = '';
  }

  send(credentials) {
    if (this.phoneForm.valid) {
      Accounts.requestPhoneVerification(credentials.phone, (err) => {
        if (err) {
          this.error = err.reason || err;
        } else {
          this.error = '';
          this.phone = credentials.phone;
        }
      });
    }
  }
}
