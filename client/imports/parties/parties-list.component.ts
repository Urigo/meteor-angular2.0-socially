import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { LoginButtons } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';
import { PaginationService, PaginationControlsCmp } from 'ng2-pagination';

import { Parties }   from '../../../both/collections/parties.collection';
import { Party } from '../../../both/interfaces/party.interface';
import { PartiesFormComponent } from './parties-form.component';

import template from './parties-list.component.html';

@Component({
  selector: 'parties-list',
  template,
  viewProviders: [PaginationService],
  directives: [PartiesFormComponent, ROUTER_DIRECTIVES, LoginButtons, PaginationControlsCmp]
})
export class PartiesListComponent extends MeteorComponent implements OnInit {
  parties: Mongo.Cursor<Party>;
  partiesSize: number = 0;
  pageSize: number = 10;
  curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
  nameOrder: number = 1;
  loading: boolean = false;

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
        sort: { name: this.nameOrder }
      };

      this.loading = true;
      this.paginationService.setCurrentPage(this.paginationService.defaultId, this.curPage.get());

      this.subscribe('parties', options, () => {
        this.parties = Parties.find({}, {sort: { name: this.nameOrder }});
        this.loading = false;
      }, true);
    });

    this.autorun(() => {
      this.partiesSize = Counts.get('numberOfParties');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
    });
  }

  removeParty(party) {
    Parties.remove(party._id);
  }

  search(value: string) {
    this.parties = Parties.find(value ? { location: value } : {});
  }

  onPageChanged(page: number) {
    this.curPage.set(page);
  }
}
