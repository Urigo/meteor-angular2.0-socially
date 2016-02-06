import {Component} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {Router, RouterLink} from '@angular/router-deprecated';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MdToolbar} from '@angular2-material/toolbar';

@Component({
  selector: 'recover',
  directives: [MATERIAL_DIRECTIVES, RouterLink, MD_INPUT_DIRECTIVES, MdToolbar],
  templateUrl: '/client/imports/auth/recover.html'
})
export class Recover extends MeteorComponent {
  recoverForm: ControlGroup;
  error: string;

  constructor(private router: Router) {
    super();

    let fb = new FormBuilder();

    this.recoverForm = fb.group({
      email: ['', Validators.required]
    });

    this.error = '';
  }

  recover(credentials) {
    if (this.recoverForm.valid) {
      Accounts.forgotPassword({ email: credentials.email}, (err) => {
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