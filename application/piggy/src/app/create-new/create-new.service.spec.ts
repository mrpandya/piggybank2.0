import { TestBed } from '@angular/core/testing';

import { CreateNewService } from './create-new.service';

describe('CreateNewService', () => {
  let service: CreateNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
