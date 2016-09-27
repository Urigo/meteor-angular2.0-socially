import { Component } from '@angular/core';

import template from './parties-upload.component.html';

@Component({
  selector: 'parties-upload',
  template
})
export class PartiesUploadComponent {
  fileIsOver: boolean = false;

  constructor() {}

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
}