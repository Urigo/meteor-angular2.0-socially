import { Component } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';
import { MeteorComponent } from 'angular2-meteor';
import { upload } from '../../../collections/methods';

@Component({
  selector: 'parties-upload',
  templateUrl: '/client/imports/parties-upload/parties-upload.html',
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
