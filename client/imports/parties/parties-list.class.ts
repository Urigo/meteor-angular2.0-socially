import { OnInit } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { PaginationService } from 'ng2-pagination';

import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/interfaces/party.interface';

export class PartiesListComponent extends MeteorComponent implements OnInit {
  parties: Mongo.Cursor<Party>;
  partiesSize: number = 0;
  pageSize: number = 10;
  curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
  nameOrder: ReactiveVar<number> = new ReactiveVar<number>(1);
  location: ReactiveVar<string> = new ReactiveVar<string>(null);
  loading: boolean = false;
  user: Meteor.User;

  constructor(private paginationService: PaginationService) {
    super();
  }

  ngOnInit() {
    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: this.pageSize,
      currentPage: this.curPage.get(),
      totalItems: this.partiesSize,
    });

    this.autorun(() => {
      const options = {
        limit: this.pageSize,
        skip: (this.curPage.get() - 1) * this.pageSize,
        sort: { name: this.nameOrder.get() }
      };

      this.loading = true;
      this.paginationService.setCurrentPage(this.paginationService.defaultId, this.curPage.get());

      this.subscribe('parties', options, this.location.get(), () => {
        this.parties = Parties.find({}, {sort: { name: this.nameOrder.get() }});
        this.loading = false;
      }, true);
    });


    this.autorun(() => {
      this.partiesSize = Counts.get('numberOfParties');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
    });

    this.subscribe('images');
  }

  removeParty(party) {
    Parties.remove(party._id);
  }

  search(value: string) {
    this.curPage.set(1);
    this.location.set(value);
  }

  changeSortOrder(nameOrder: string) {
    this.nameOrder.set(parseInt(nameOrder));
  }

  onPageChanged(page: number) {
    this.curPage.set(page);
  }

  isOwner(party: Party): boolean {
    return this.user && this.user._id === party.owner;
  }
}
