import {DemoCollection} from "../../../both/collections/demo.collection";
import {Demo} from "../../../both/models/demo.model";
export class Main {
  start(): void {
    this.initFakeData();
  }

  initFakeData(): void {
    if (DemoCollection.find({}).cursor.count() === 0) {
      const data: Demo[] = [{
        name: 'Dotan',
        age: 25
      }, {
        name: 'Liran',
        age: 26
      }, {
        name: 'Uri',
        age: 30
      }];
      
      data.forEach((obj: Demo) => {
        DemoCollection.insert(obj);
      });
    }
  }
}
