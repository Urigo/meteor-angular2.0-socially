import { Component } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';
import { MeteorComponent } from 'angular2-meteor';
import { upload } from '../../../collections/methods';

import template from './parties-upload.html';

@Component({
  selector: 'parties-upload',
  template,
  directives: [ FileDropDirective ]
})
export class PartiesUpload extends MeteorComponent {
  public fileIsOver: boolean = false;
  public uploading: boolean = false;

  constructor() {
    super();
  }

  public fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  public onFileDrop(file: File): void {
    this.uploading = true;

    upload(file, (result) => {
      this.uploading = false;
    }, (error) => {
      this.uploading = false;
      console.log(`Something went wrong!`, error);
    });
  }
}
