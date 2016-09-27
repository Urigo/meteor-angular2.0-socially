import { Component } from '@angular/core';

import template from './parties-upload.component.html';

import { upload } from '../../../../both/methods/images.methods';

@Component({
  selector: 'parties-upload',
  template
})
export class PartiesUploadComponent {
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