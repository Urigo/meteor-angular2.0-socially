import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { FormBuilder, ControlGroup, Validators } from '@angular/common';
import { MATERIAL_DIRECTIVES } from 'ng2-material';
import { Router , ROUTER_DIRECTIVES} from '@angular/router';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdToolbar } from '@angular2-material/toolbar';

import template from './login.mobile.html';

@Component({
  selector: 'login',
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, MD_INPUT_DIRECTIVES, MdToolbar],
  template
})
export class Login extends MeteorComponent {
  error: string;

  constructor(private router: Router) {
    super();

    this.error = '';
  }
}
