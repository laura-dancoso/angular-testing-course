import { fakeAsync, flush, tick } from "@angular/core/testing";

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

  it('Asynchronous test example - Plain Promise', ()=>{
    let test = false;

    console.log('Creating promise');

    Promise.resolve().then(()=>{
      console.log('Promise evaluated succesfully');
      test = true;
    });

    expect(test).toBeTruthy();
  });
});
