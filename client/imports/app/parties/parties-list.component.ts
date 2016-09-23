import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';

import template from './parties-list.component.html';

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@Component({
  selector: 'parties-list',
  template
})
export class PartiesListComponent implements OnInit, OnDestroy {
  parties: Observable<Party[]>;
  partiesSub: Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();

  ngOnInit() {
    const options: Options = {
      limit: this.pageSize,
      skip: (this.curPage - 1) * this.pageSize,
      sort: { name: this.nameOrder }
    };

    this.partiesSub = MeteorObservable.subscribe('parties', options).subscribe(() => {
      this.parties = Parties.find({}, {
        sort: {
          name: this.nameOrder
        }
      }).zone();
    });

    this.pageSize.next(10);
    this.curPage.next(1);
    this.nameOrder.next(1);
  }

  removeParty(party: Party): void {
    Parties.remove(party._id);
  }

  search(value: string): void {
    this.parties = Parties.find(value ? { location: value } : {}).zone();
  }

  ngOnDestroy() {
    this.partiesSub.unsubscribe();
  }
}
