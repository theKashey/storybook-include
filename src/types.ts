import type { Annotations, DecoratorFunction } from '@storybook/addons';

export type StoryOptions = {
  name: string;
  filename: string;
};
export type StoryDecoratorFactory = (
  story: Annotations<unknown, unknown>,
  options: StoryOptions
) => DecoratorFunction[] | undefined | void;
