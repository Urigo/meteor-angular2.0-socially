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
  verifyForm: FormGroup;
  isStepTwo: boolean = false;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.phoneForm = this.formBuilder.group({
      phone: ['', Validators.required]
    });

    this.verifyForm = this.formBuilder.group({
        code: ['', Validators.required]
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
            this.isStepTwo = true;
          }
        });
      });
    }
  }


  verify() {
    if (this.verifyForm.valid) {
      Accounts.verifyPhone(this.phone, this.verifyForm.value.code, (err) => {
        this.zone.run(() => {
          if (err) {
            this.error = err.reason || err;
          }
          else {
            this.router.navigate(['/']);
          }
        });
      });
    }
  }
}