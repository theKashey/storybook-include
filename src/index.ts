import { findDecorators, prepareLibrary } from './library';
import { StoryOptions } from './types';

export { registerStorybookInclude, addStoryDecorators, removeAllIncludes } from './library';

/**
 * @deprecated this API is not expected to be used by the end user
 * @see addStoryDecorators
 * @param storyFn
 * @param storyName
 * @param filename
 */
export const wrapStory = (storyFn: any, storyName: string, filename: string) => {
  const options: StoryOptions = {
    name: storyName,
    filename,
  };
  prepareLibrary();
  findDecorators(filename).forEach((decorator) => {
    const toAdd = decorator(storyFn, options);
    if (toAdd) {
      storyFn.decorators = storyFn.decorators || [];
      storyFn.decorators.push(...toAdd);
    }
  });
};
