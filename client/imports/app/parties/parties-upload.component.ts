import {Component, OnInit} from '@angular/core';

import template from './parties-upload.component.html';

import { upload } from '../../../../both/methods/images.methods';
import {Subject, Subscription} from "rxjs";
import {MeteorObservable} from "meteor-rxjs";

@Component({
  selector: 'parties-upload',
  template
})
export class PartiesUploadComponent implements OnInit {
  fileIsOver: boolean = false;
  uploading: boolean = false;
  files: Subject<string[]> = new Subject<string[]>();
  thumbsSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.files.subscribe((filesArray) => {
      MeteorObservable.autorun().subscribe(() => {
        if (this.thumbsSubscription) {
          this.thumbsSubscription.unsubscribe();
          this.thumbsSubscription = undefined;
        }

        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe();
      });
    });
  }

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