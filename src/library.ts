import { StoryDecoratorFactory } from './types';

let libraryIsDirty = false;
let library: Record<string, StoryDecoratorFactory[]> = {};
let libraryReference = new Set<any>();

let newDecorators: StoryDecoratorFactory[] = [];

export const removeAllIncludes = () => {
  libraryIsDirty = true;
  library = {};
  libraryReference = new Set();
};

export const addStoryDecorators = (factory: StoryDecoratorFactory): void => {
  newDecorators.push(factory);
};

/**
 * performs a sorting among registered keys
 */
export const prepareLibrary = () => {
  if (libraryIsDirty) {
    const keys = Object.keys(library).sort((a, b) => b.length - a.length);
    const newLibrary = keys.reduce((acc, key) => {
      acc[key] = library[key];
      return acc;
    }, {} as typeof library);
    library = newLibrary;
    libraryIsDirty = false;
  }
};

export const registerStorybookInclude = (filename: string, importer: () => any) => {
  newDecorators = [];
  const decorators = importer();
  if (!decorators || !libraryReference.has(decorators)) {
    library[filename] = newDecorators;
    libraryReference.add(decorators);
    libraryIsDirty = true;
  }
};

export const findDecorators = (storyFile: string): StoryDecoratorFactory[] =>
  Object.keys(library)
    .filter((filename) => storyFile.includes(filename))
    .reduce((acc, key) => {
      acc.push(...library[key]);
      return acc;
    }, [] as StoryDecoratorFactory[]);
