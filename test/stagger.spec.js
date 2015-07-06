import {VelocityAnimator} from '../src/animator';

import {animationEvent} from 'aurelia-templating';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-velocity', () => {

  let elem;
  let animator;
  let container;
  let seq;
  let testSequence;

  beforeEach( () => {
    //stop all animations running on the test element
    if(animator) animator.stop(elem,true);

    loadFixtures('animation.html');
    container = $("#animation").eq(0)[0];
    seq = container.querySelector("#test-sequence");

    testSequence = [
      { e: seq.children[0], p: { opacity:[1,0], translateY: [0,50] }, o: { duration: 100 } },
      { e: seq.children[1], p: { opacity:[1,0] }, o: { delay:50, easing:"ease-in", duration: 100, sequenceQueue: false } },
      { e: seq.children[2], p: { opacity:[1,0], translateY: [0,50] }, o: { delay:0, easing:[ 500, 20 ],duration: 100 } }
    ];

    animator = new VelocityAnimator(container);
  });

  describe('staggering', () => {
    let elem;
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem,true);
    });

    /*it('publishes stagger next events', (done) => {
      let proms = []
        , eventCalled = false;

      var listener = document.addEventListener(animationEvent.staggerNext, () => eventCalled = true);

      elems.each( (idx, elem) => {
        proms.push(sut.enter(elem));
      });

      Promise.all(proms).then( () => {
        expect(eventCalled).toBe(true);
        document.removeEventListener(animationEvent.staggerNext, listener);
        done();
      });
    });*/

  });

});
