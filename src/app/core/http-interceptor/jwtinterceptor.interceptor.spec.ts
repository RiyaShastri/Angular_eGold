import { TestBed } from "@angular/core/testing";

import { JwtInterceptor } from "./jwtinterceptor.interceptor";

describe("JwtinterceptorInterceptor", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [JwtInterceptor],
    })
  );

  it("should be created", () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
