import { TestBed, inject } from '@angular/core/testing';

import { WebConfigService } from './web-config.service';

describe('WebConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebConfigService]
    });
  });

  it('should be created', inject([WebConfigService], (service: WebConfigService) => {
    expect(service).toBeTruthy();
  }));
});
