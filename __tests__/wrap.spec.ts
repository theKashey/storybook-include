/* eslint-disable @typescript-eslint/ban-ts-comment */
import { wrapStory, registerStorybookInclude, addStoryDecorators, removeAllIncludes } from '../src';

describe('wrap', () => {
  beforeEach(() => {
    removeAllIncludes();
  });

  it('not wraps if no wrapper defined', () => {
    const a = () => null;
    wrapStory(a, 'a', '/home/test/test');
    // @ts-ignore
    expect(a.decorators).toBe(undefined);
  });

  it('expect wrap twice', () => {
    const a = () => null;
    const fn = () => null;
    registerStorybookInclude('/home/', () => ({
      default: () => addStoryDecorators(() => [fn]),
    }));
    wrapStory(a, 'a', '/home/test/test');
    // @ts-ignore
    expect(a.decorators).toEqual([fn]);
  });

  it('expect wrap trice', () => {
    const a = () => null;
    const fn1 = () => null;
    const fn2 = () => null;
    const fn3 = () => null;
    registerStorybookInclude('/home/', () => ({
      default: () => addStoryDecorators(() => [fn1]),
    }));
    registerStorybookInclude('/home/test/', () => ({
      default: () => addStoryDecorators(() => [fn2]),
    }));
    registerStorybookInclude('/other/', () => ({
      default: () => addStoryDecorators(() => [fn3]),
    }));

    wrapStory(a, 'a', '/home/test/test');
    // @ts-ignore
    expect(a.decorators).toEqual([fn2, fn1]);
  });

  it('can amend story manually', () => {
    const a = () => null;
    registerStorybookInclude('/home/', () => ({
      default: () =>
        addStoryDecorators((fn, opts) => {
          fn.args = opts;
        }),
    }));
    wrapStory(a, 'a', '/home/test/test');
    // @ts-ignore
    expect(a.decorators).toBe(undefined);
    // @ts-ignore
    expect(a.args).toEqual({ name: 'a', filename: '/home/test/test' });
  });
});
