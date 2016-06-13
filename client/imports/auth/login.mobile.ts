import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { FormBuilder, ControlGroup, Validators } from '@angular/common';
import { MATERIAL_DIRECTIVES } from 'ng2-material';
import { Router , RouterLink} from '@angular/router-deprecated';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdToolbar } from '@angular2-material/toolbar';

@Component({
  selector: 'login',
  directives: [MATERIAL_DIRECTIVES, RouterLink, MD_INPUT_DIRECTIVES, MdToolbar],
  templateUrl: '/client/imports/auth/login.mobile.html'
})
export class Login extends MeteorComponent {
  error: string;

  constructor(private router: Router) {
    super();

    this.error = '';
  }
}
