import { MeteorComponent } from 'angular2-meteor';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Parties } from '../../../collections/parties';

@InjectUser()
export class PartiesList extends MeteorComponent {
  parties: Mongo.Cursor<Party>;
  pageSize: number = 10;
  curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
  nameOrder: ReactiveVar<number> = new ReactiveVar<number>(1);
  partiesSize: number = 0;
  location: ReactiveVar<string> = new ReactiveVar<string>(null);
  user: Meteor.User;

  constructor() {
    super();

    this.autorun(() => {
      let options = {
        limit: this.pageSize,
        skip: (this.curPage.get() - 1) * this.pageSize,
        sort: { name: this.nameOrder.get() }
      };

      this.subscribe('parties', options, this.location.get(), () => {
        this.parties = Parties.find({}, { sort: { name: this.nameOrder.get() } });
      }, true);

      this.subscribe('images');
    });

    this.autorun(() => {
      this.partiesSize = Counts.get('numberOfParties');
    }, true);
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
    if (this.user) {
      return this.user._id === party.owner;
    }

    return false;
  }
}
