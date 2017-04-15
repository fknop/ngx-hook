import { EventEmitter } from '@angular/core';


export type LifecycleHook = 
  'ngOnInit' | 'ngOnDestroy' | 'ngOnChanges' | 'ngDoCheck' | 
  'ngAfterContentInit' | 'ngAfterContentChecked' | 
  'ngAfterViewInit' | 'ngAfterViewChecked';

export function Hook (hook: LifecycleHook = 'ngOnDestroy') {
  return function (target: any, key: any) {

    const oldNgOnInit = target['ngOnInit'];
    target['ngOnInit'] = function () {
      if (!this[key]) {
        this[key] = new EventEmitter<any>();
      }

      if (oldNgOnInit) {
        oldNgOnInit.bind(this)();
      }
    }

    const old = target[hook];

    target[hook] = function () {

      if (old) {
        old.bind(this)();
      }

      if (this[key] && this[key].next) {
        this[key].next();
      }
    }
  }
}