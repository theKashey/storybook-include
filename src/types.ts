import type { Annotations, DecoratorFunction } from '@storybook/addons';

export type StoryOptions = {
  name: string;
  filename: string;
};
export type StoryDecoratorFactory<ReturnType = any> = (
  story: Annotations<unknown, unknown>,
  options: StoryOptions
) => DecoratorFunction<ReturnType>[] | undefined | void;
