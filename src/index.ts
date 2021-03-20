import { findDecorators, prepareLibrary } from './library';
import { StoryOptions } from './types';

export { registerStorybookInclude, addStoryDecorators, removeAllIncludes } from './library';

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
