# ngx-hook

`ngx-hook` is a small utility library for `Angular`. 
It provides a decorator `Hook` that emit on an `EventEmitter`. It is particularly useful for unsubscribing
from observable streams in a functional way.

This may be a temporary project as this (https://github.com/angular/angular/issues/13248) may solve it in the future.

## Usage

Note: this example can actually be achieved with the async pipe. 

```typescript
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

import { Hook } from 'ngx-hook';


@Component({
  selector: 'counter',
  template: '{{ counter }}'
})
export class CounterComponent implements OnInit {

  @Hook() ngOnDestroy$ = new EventEmitter<any>();

  counter: number = 0;

  ngOnInit () {
    Observable
      .timer(0, 1000)
      .takeUntil(this.ngOnDestroy$)
      .subscribe((value) => { this.counter = value; });
  }
}
```

You can hook to any lifecycle hook that you want. By default it will hook to `ngOnDestroy` as it's the more useful one.