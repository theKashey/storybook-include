import { wrapStory, registerStorybookInclude } from 'storybook-include';
import '../../storybook.include.ts';
import '../storybook.include.ts';
import './storybook.include.js';

const notStory = () => null;

export const Story1 = () => null;
export const Story2 = () => null;
export default {
  title: 'case'
};
registerStorybookInclude("@/__fixtures__/babel/story/", () => require("./storybook.include.js"));
registerStorybookInclude("@/__fixtures__/babel/", () => require("../storybook.include.ts"));
registerStorybookInclude("@/__fixtures__/", () => require("../../storybook.include.ts"));
wrapStory(Story1, "Story1", "@/__fixtures__/babel/story/actual.js");
wrapStory(Story2, "Story2", "@/__fixtures__/babel/story/actual.js");