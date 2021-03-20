import { wrapStory, registerStorybookInclude } from 'storybook-include';

const notStory = () => null;

export const Story1 = () => null;
export const Story2 = () => null;
export default {
  title: 'case',
};
registerStorybookInclude('@/__fixtures__/babel/story/storybook.include.js', () => require('storybook.include.js'));
registerStorybookInclude('@/__fixtures__/babel/storybook.include.ts', () => require('../storybook.include.ts'));
registerStorybookInclude('@/__fixtures__/storybook.include.ts', () => require('../../storybook.include.ts'));
wrapStory(Story1, 'Story1', '@/__fixtures__/babel/story/actual.js');
wrapStory(Story2, 'Story2', '@/__fixtures__/babel/story/actual.js');
