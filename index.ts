import { EventEmitter } from '@angular/core';

export type LifecycleHook = 
  'ngOnInit' | 'ngOnDestroy' | 'ngOnChanges' | 'ngDoCheck' | 
  'ngAfterContentInit' | 'ngAfterContentChecked' | 
  'ngAfterViewInit' | 'ngAfterViewChecked';

export function Hook (hook: LifecycleHook = 'ngOnDestroy') {

  return function (target: any, key: any) {
    
    const ngOnInit = target['ngOnInit'];
    const old = target[hook];

    target['ngOnInit'] = function () {

      this[key] = this[key] || new EventEmitter<any>();
      if (ngOnInit) { ngOnInit.call(this); }
    }

    target[hook] = function () {

      if (old) { old.call(this); }
      if (this[key] && this[key].next && this[key].subscribe) {
        this[key].next();
      }
    }
  }
}