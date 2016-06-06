import { Component } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';

@Component({
  selector: 'parties-upload',
  templateUrl: '/client/imports/parties-upload/parties-upload.html',
  directives: [ FileDropDirective ]
})
export class PartiesUpload {
  public fileIsOver: boolean = false;

  constructor() {}

  public fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  public onFileDrop(file: File): void {
    console.log('Got file');
  }
}
