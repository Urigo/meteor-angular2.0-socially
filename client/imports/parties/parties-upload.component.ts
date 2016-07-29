import { Component } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';

import template from './parties-upload.component.html';

@Component({
  selector: 'parties-upload',
  template,
  directives: [ FileDropDirective ]
})
export class PartiesUpload {
  fileIsOver: boolean = false;

  constructor() {}

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    console.log('Got file');
  }
}
