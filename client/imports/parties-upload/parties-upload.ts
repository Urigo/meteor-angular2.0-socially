import { Component } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';

@Component({
  selector: 'parties-upload',
  templateUrl: '/client/imports/parties-upload/parties-upload.html',
  directives: [ FileDropDirective ]
})
export class PartiesUpload {
  constructor() {}
}
