import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { routeAlertGuard } from './route-alert.guard';

describe('routeAlertGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routeAlertGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
