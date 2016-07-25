import { DemoCollection } from '../../../both/collections/demo-collection';
import { DemoDataObject } from '../../../both/models/demo-data-object';

export class Main {
  constructor() {
  }

  start():void {
    this.initFakeData();
  }

  initFakeData():void {
    if (DemoCollection.find({}).count() === 0) {
      DemoCollection.insert(<DemoDataObject>{
        name: 'Dotan',
        age: 25
      });

      DemoCollection.insert(<DemoDataObject>{
        name: 'Liran',
        age: 26
      });

      DemoCollection.insert(<DemoDataObject>{
        name: 'Uri',
        age: 30
      });
    }
  }
}
