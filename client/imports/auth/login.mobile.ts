import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { FormBuilder, ControlGroup, Validators } from '@angular/common';
import { MATERIAL_DIRECTIVES } from 'ng2-material';
import { Router , RouterLink} from '@angular/router-deprecated';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdToolbar } from '@angular2-material/toolbar';
import { Accounts } from 'meteor/accounts-base';

@Component({
  selector: 'login',
  directives: [MATERIAL_DIRECTIVES, RouterLink, MD_INPUT_DIRECTIVES, MdToolbar],
  templateUrl: '/client/imports/auth/login.mobile.html'
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
