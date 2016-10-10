// chai uses as asset library
import {assert} from 'chai';

// Angular 2 tests imports
import {TestBed, TestModuleMetadata} from "@angular/core/testing";

// Project imports
import {DemoComponent} from './demo.component';
import {Demo} from "../../../../both/models/demo.model";
import {DemoDataService} from "./demo-data.service";
import {Observable, Subject, BehaviorSubject} from "rxjs";

describe('DemoComponent', () => {
  let demoComponentInstance: DemoComponent;
  let demoComponentElement;
  let componentFixture;

  let mockData = new BehaviorSubject([]);
  mockData.next([
    <Demo>{
      name: 'Test',
      age: 10
    }
  ]);

  let mockDataService = {
    getData: () => mockData
  };

  beforeEach(() => {
    TestBed.configureTestingModule(<TestModuleMetadata>{
      declarations: [DemoComponent],
      providers: [
        {provide: DemoDataService, useValue: mockDataService}
      ]
    });

    componentFixture = TestBed.createComponent(DemoComponent);
    demoComponentInstance = componentFixture.componentInstance;
    demoComponentElement = componentFixture.debugElement;
  });

  describe('@Component instance', () => {
    it('Should have a greeting string on the component', () => {
      assert.typeOf(demoComponentInstance.greeting, 'string', 'Greeting should be a string!');
    });

    it('Should say hello to the component on the greeting string', () => {
      assert.equal(demoComponentInstance.greeting, 'Hello Demo Component!');
    });

    it('Should have an Observable (from the mock) of the instance', () => {
      demoComponentInstance.ngOnInit();
      assert.isTrue(demoComponentInstance.data instanceof Observable);
    });

    it('Should have an items in the Observable', (done) => {
      demoComponentInstance.ngOnInit();
      assert.isTrue(demoComponentInstance.data instanceof Observable);

      demoComponentInstance.data.subscribe((data) => {
        assert.equal(data.length, 1);
        assert.typeOf(data, 'array');

        done();
      });
    });
  });

  describe('@Component view', () => {
    it('Should print the greeting to the screen', () => {
      componentFixture.detectChanges();
      assert.include(demoComponentElement.nativeElement.innerHTML, 'Hello Demo Component');
    });

    it('Should change the greeting when it changes', () => {
      componentFixture.detectChanges();
      assert.include(demoComponentElement.nativeElement.innerHTML, 'Hello Demo Component');
      demoComponentInstance.greeting = 'New Test Greeting';
      componentFixture.detectChanges();
      assert.include(demoComponentElement.nativeElement.innerHTML, 'New Test Greeting');
    });

    it('Should display a list of items in the screen', () => {
      componentFixture.detectChanges();
      assert.isNotNull(demoComponentElement.nativeElement.querySelector('ul'));
    });
  });
});
