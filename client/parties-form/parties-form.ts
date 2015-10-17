/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/angular2';

import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/angular2';

@Component({
    selector: 'parties-form'
})
@View({
    templateUrl: 'client/parties-form/parties-form.html',
    directives: [FORM_DIRECTIVES]
})
export class PartiesForm { }
