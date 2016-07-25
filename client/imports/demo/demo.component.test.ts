// chai uses as asset library
import { assert } from 'chai';

// Angular 2 tests imports
import { inject } from '@angular/core/testing';
import { provide } from '@angular/core';
import { TestComponentBuilder } from '@angular/compiler/testing';

// Project imports
import { DemoComponent } from './demo.component';
import { DemoDataService } from './demo-data.service';
import { DemoDataObject } from '../../../both/models/demo-data-object';

describe('DemoComponent', () => {
  let demoComponentInstance:DemoComponent;
  let demoComponentElement;
  let componentFixture;

  let mockDataArray = [
    <DemoDataObject>{
      name: 'Test',
      age: 10
    }
  ];

  let mockDataService = {
    getData: () => mockDataArray
  };

  beforeEach(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    // We inject TestComponentBuilder that provides use the ability to control the injections of the component
    // Then we will request to get DemoComponent with a mock service instead of the real DemoDataService
    // The fixture created contain the element and the instance of the Component class
    // Finally, we need to save 'detectChanges' and call it to flush the changes into the view.
    return tcb.overrideProviders(DemoComponent, [
      provide(DemoDataService, {useValue: mockDataService})
    ]).createAsync(DemoComponent).then((fixture) => {
      componentFixture = fixture;

      demoComponentInstance = componentFixture.componentInstance;
      demoComponentElement = componentFixture.nativeElement;

      componentFixture.detectChanges();
    });
  }));

  describe('@Component instance', () => {
    it('Should have a greeting string on the component', () => {
      assert.typeOf(demoComponentInstance.greeting, 'string', 'Greeting should be a string!');
    });

    it('Should say hello to the component on the greeting string', () => {
      assert.equal(demoComponentInstance.greeting, 'Hello Demo Component!');
    });

    it('Should have an array (from the mock) of the instance', () => {
      assert.typeOf(demoComponentInstance.getData(), 'array');
    });

    it('Should have an items in the array', () => {
      assert.typeOf(demoComponentInstance.getData(), 'array');
      assert.equal((<Array>demoComponentInstance.getData()).length, 1);
    });
  });

  describe('@Component view', () => {
    it('Should print the greeting to the screen', () => {
      assert.include(demoComponentElement.innerHTML, 'Hello Demo Component');
    });

    it('Should change the greeting when it changes', () => {
      assert.include(demoComponentElement.innerHTML, 'Hello Demo Component');
      demoComponentInstance.greeting = 'New Test Greeting';
      componentFixture.detectChanges();
      assert.include(demoComponentElement.innerHTML, 'New Test Greeting');
    });

    it('Should display a list of items in the screen', () => {
      assert.isNotNull(demoComponentElement.querySelector('ul'));
    });

    it('Should add item to the list when modifying the data in the service', () => {
      assert.equal(demoComponentElement.querySelectorAll('li').length, 1);

      mockDataArray.push({
        name: 'Dotan',
        age: 20
      });

      componentFixture.detectChanges();

      assert.equal(demoComponentElement.querySelectorAll('li').length, 2);
    });
  });
});
