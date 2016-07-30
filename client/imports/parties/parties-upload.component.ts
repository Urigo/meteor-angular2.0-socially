import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FileDropDirective } from 'angular2-file-drop';
import { MeteorComponent } from 'angular2-meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';

import { upload } from '../../../both/methods/images.methods';
import { Thumbs } from '../../../both/collections/images.collection';
import { Thumb } from '../../../both/interfaces/image.interface';

import template from './parties-upload.component.html';

@Component({
  selector: 'parties-upload',
  template,
  directives: [ FileDropDirective ]
})
export class PartiesUpload extends MeteorComponent implements OnInit {
  fileIsOver: boolean = false;
  uploading: boolean = false;
  files: ReactiveVar<string[]> = new ReactiveVar<string[]>([]);
  thumbs: Mongo.Cursor<Thumb>;
  @Output() onFile: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.autorun(() => {
      this.subscribe('thumbs', this.files.get(), () => {
        this.thumbs = Thumbs.find({
          originalStore: 'images',
          originalId: {
            $in: this.files.get()
          }
        });
      }, true);
    });
  }

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    this.uploading = true;

    upload(file)
      .then((result) => {
        this.uploading = false;
        this.addFile(result);
      })
      .catch((error) => {
        this.uploading = false;
        console.log(`Something went wrong!`, error);
      });
  }

  addFile(file) {
    // update array with files
    this.files.get().push(file._id);
    this.files.set(this.files.get());
    // emit new file
    this.onFile.emit(file._id);
  }

  reset() {
    this.files.set([]);
  }
}
