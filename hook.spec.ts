import 'core-js';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { ComponentFixture, TestBed, tick, async, fakeAsync } from '@angular/core/testing';
import { DebugElement, EventEmitter, Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeUntil';

import { Hook } from './index';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

@Component({
  selector: 'test-component',
  template: ''
})
export class TestComponent {
  @Hook() ngOnDestroy$ = new EventEmitter<any>();
  @Hook('ngOnInit') ngOnInit$ = new EventEmitter<any>();

  valueDestroy: number;
  valueInit: number;

  constructor () {
    Observable
      .timer(0, 1000)
      .takeUntil(this.ngOnInit$)
      .subscribe((n) => {
        this.valueInit = n;
      });
  }

  ngOnInit () {

    Observable
      .timer(0, 1000)
      .takeUntil(this.ngOnDestroy$)
      .subscribe((n) => {
        this.valueDestroy = n;
      });
  }
}

describe('Hook', () => {
  let comp: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
  });

  it('ngOnInit', fakeAsync(() => {
    const c = new TestComponent();
    const spy = spyOn(c.ngOnInit$, 'next').and.callThrough();
    expect(c.valueInit).toBeUndefined();

    tick(3000);
    expect(c.valueInit).toEqual(3);

    c.ngOnInit();
    expect(spy).toHaveBeenCalled();

    tick(3000);
    expect(c.valueInit).toEqual(3);

    (c as any).ngOnDestroy();
    expect(c.valueDestroy).toEqual(3);
  }));

  it('ngOnDestroy', fakeAsync(() => {

    fixture.detectChanges();

    tick(3000);
    expect(comp.valueDestroy).toEqual(3);


    tick(1000);
    expect(comp.valueDestroy).toEqual(4);

    // Destroy the component, the observable should stop emitting
    fixture.destroy();

    tick(2000);
    expect(comp.valueDestroy).toEqual(4);
  }));

});
