// chai uses as asset library
import { assert } from 'chai';
import { Mongo } from 'meteor/mongo';

// Project imports
import { DemoDataService } from './demo-data.service';

describe('DemoDataService', () => {
  let demoDataService:DemoDataService;

  beforeEach(() => {
    // Create the service instance
    demoDataService = new DemoDataService();
  });

  it('Should return MongoDB Cursor when requesting the data', () => {
    assert.isTrue(demoDataService.getData() instanceof Mongo.Cursor);
  });
});
