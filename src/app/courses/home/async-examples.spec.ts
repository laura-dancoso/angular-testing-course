import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of} from "rxjs";
import { delay } from "rxjs/operators";

fdescribe('Async Testing Examples',()=>{

  it('Asynchronous test example with Jasmine done()', (done: DoneFn)=>{

    let test = false;

    setTimeout(()=>{
      test =true;
      expect(test).toBeTruthy();
      done();
    }, 500);

  });

  it('Asynchronous test example with setTimeOut()', fakeAsync(()=>{
    let test = false;
    setTimeout(()=>{
      test =true;
    }, 1000);
    // tick(1000);
    flush();
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - Plain Promise', fakeAsync(()=>{
    let test = false;

    console.log('Creating promise');

    Promise.resolve().then(()=>{
      console.log('Promise evaluated succesfully');
      test = true;
    });
    console.log('Running test assertions');
    flushMicrotasks();
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - Promises + setTimeOut()', fakeAsync(()=>{
    let counter = 0;
    Promise.resolve().then(()=>{
      counter+=10;
      setTimeout(()=>{
        counter+=1;
      }, 1000);
    });
    
    expect(counter).toBe(0);
    flushMicrotasks();  // triggering the code inside the Promise
    expect(counter).toBe(10);
    flush(); // triggering the code inside the setTimeOut()
    expect(counter).toBe(11);
  }));

  it('Asynchronous test example - Observables', fakeAsync(()=>{
    let test = false;
    console.log('Creating Observable');
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(()=>{
      test=true;
    });
    tick(1000);
    console.log('Running test assertions');
    expect(test).toBeTruthy();
  }));

});
