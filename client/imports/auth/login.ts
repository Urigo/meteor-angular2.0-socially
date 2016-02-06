import {Component} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {Router, RouterLink} from '@angular/router-deprecated';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MdToolbar} from '@angular2-material/toolbar';

@Component({
  selector: 'login',
  directives: [MATERIAL_DIRECTIVES, RouterLink, MD_INPUT_DIRECTIVES, MdToolbar],
  templateUrl: '/client/imports/auth/login.html'
})
export class Login extends MeteorComponent {
  loginForm: ControlGroup;
  error: string;

  constructor(private router: Router) {
    super();

    let fb = new FormBuilder();

    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.error = '';
  }

  login(credentials) {
    if (this.loginForm.valid) {
      Meteor.loginWithPassword(credentials.email, credentials.password, (err) => {
        if (err) {
          this.error = err;
        }
        else {
          this.router.navigate(['/PartiesList']);
        }
      });
    }
  }
}