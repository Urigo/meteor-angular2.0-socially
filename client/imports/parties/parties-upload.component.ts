import { Component } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';

import template from './parties-upload.component.html';

@Component({
  selector: 'parties-upload',
  template,
  directives: [ FileDropDirective ]
})
export class PartiesUpload {
  constructor() {}
}
