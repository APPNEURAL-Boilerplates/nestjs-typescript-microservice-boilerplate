import { Test } from '@nestjs/testing';
import { MathService } from '../src/modules/math/math.service';

describe('MathService', () => {
  let service: MathService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MathService]
    }).compile();

    service = moduleRef.get(MathService);
  });

  it('sums a list of numbers', () => {
    expect(service.sum([1, 2, 3])).toBe(6);
  });

  it('returns 0 for an empty list', () => {
    expect(service.sum([])).toBe(0);
  });
});
