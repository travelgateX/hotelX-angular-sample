import { TestBed, inject } from '@angular/core/testing';

import { RequestStorageService } from './request-storage.service';

describe('RequestStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestStorageService]
    });
  });

  it('should be created', inject([RequestStorageService], (service: RequestStorageService) => {
    expect(service).toBeTruthy();
  }));
});
