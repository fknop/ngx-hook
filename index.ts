
export type LifecycleHook = 
  'ngOnInit' | 'ngOnDestroy' | 'ngOnChanges' | 'ngDoCheck' | 
  'ngAfterContentInit' | 'ngAfterContentChecked' | 
  'ngAfterViewInit' | 'ngAfterViewChecked';

export function Hook (hook: LifecycleHook = 'ngOnDestroy') {
  return function (target: any, key: any) {

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