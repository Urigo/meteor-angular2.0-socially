import { Component } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';

import { upload } from '../../../both/methods/images.methods';

import template from './parties-upload.component.html';

@Component({
  selector: 'parties-upload',
  template,
  directives: [ FileDropDirective ]
})
export class PartiesUpload {
  fileIsOver: boolean = false;
  uploading: boolean = false;

  constructor() {}

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    this.uploading = true;

    upload(file)
      .then(() => {
        this.uploading = false;
      })
      .catch((error) => {
        this.uploading = false;
        console.log(`Something went wrong!`, error);
      });
  }
}
