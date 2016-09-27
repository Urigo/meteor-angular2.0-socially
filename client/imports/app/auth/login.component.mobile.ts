import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';

import template from './login.component.mobile.html';

@Component({
  selector: 'login',
  template
})
export class MobileLoginComponent implements OnInit {
  error: string = '';
  phoneForm: FormGroup;
  phone: string;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.phoneForm = this.formBuilder.group({
      phone: ['', Validators.required]
    });
  }

  send() {
    if (this.phoneForm.valid) {
      Accounts.requestPhoneVerification(this.phoneForm.value.phone, (err) => {
        this.zone.run(() => {
          if (err) {
            this.error = err.reason || err;
          } else {
            this.phone = this.phoneForm.value.phone;
            this.error = '';
          }
        });
      });
    }
  }
}