import {OnDestroy, OnInit} from "@angular/core";
import {Observable, Subscription, Subject} from "rxjs";
import {Party} from "../../../../both/models/party.model";
import {PaginationService} from "ng2-pagination";
import {MeteorObservable} from "meteor-rxjs";
import {Parties} from "../../../../both/collections/parties.collection";
import {Counts} from "meteor/tmeasday:publish-counts";
import {InjectUser} from "angular2-meteor-accounts-ui";

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@InjectUser('user')
export class PartiesList implements OnInit, OnDestroy {
  parties: Observable<Party[]>;
  partiesSub: Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  partiesSize: number = 0;
  autorunSub: Subscription;
  location: Subject<string> = new Subject<string>();
  user: Meteor.User;
  imagesSubs: Subscription;

  constructor(private paginationService: PaginationService) {

  }

  ngOnInit() {
    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.location
    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.partiesSub) {
        this.partiesSub.unsubscribe();
      }

      this.partiesSub = MeteorObservable.subscribe('parties', options, location).subscribe(() => {
        this.parties = Parties.find({}, {
          sort: {
            name: nameOrder
          }
        }).zone();
      });
    });

    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.partiesSize
    });

    this.pageSize.next(10);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.location.next('');

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.partiesSize = Counts.get('numberOfParties');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
    });
  }

  removeParty(party: Party): void {
    Parties.remove(party._id);
  }

  search(value: string): void {
    this.curPage.next(1);
    this.location.next(value);
  }

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  changeSortOrder(nameOrder: string): void {
    this.nameOrder.next(parseInt(nameOrder));
  }

  isOwner(party: Party): boolean {
    return this.user && this.user._id === party.owner;
  }

  ngOnDestroy() {
    this.partiesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
    this.imagesSubs.unsubscribe();
  }
}