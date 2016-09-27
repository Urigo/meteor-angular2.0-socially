import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import template from './login.component.mobile.html';

@Component({
  selector: 'login',
  template
})
export class MobileLoginComponent implements OnInit {
  error: string = '';

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit() {}
}