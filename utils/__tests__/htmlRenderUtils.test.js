import { normalizeUrl } from '../htmlRenderUtils';

it('modify entry urls', () => {
  expect(normalizeUrl('/entry/114866551')).toBe('https://www.eksisozluk.com/entry/114866551');
  expect(normalizeUrl('https://www.eksisozluk.com/entry/114866551')).toBe('https://www.eksisozluk.com/entry/114866551');
});