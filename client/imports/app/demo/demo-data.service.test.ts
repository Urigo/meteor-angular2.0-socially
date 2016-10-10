// chai uses as asset library
import { assert } from 'chai';

// Project imports
import { DemoDataService } from './demo-data.service';
import { Observable } from "rxjs";

describe('DemoDataService', () => {
  let demoDataService:DemoDataService;

  beforeEach(() => {
    // Create the service instance
    demoDataService = new DemoDataService();
  });

  it('Should return Observable when requesting the data', () => {
    assert.isTrue(demoDataService.getData() instanceof Observable);
  });
});
