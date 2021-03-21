import { StoryDecoratorFactory } from './types';

let libraryIsDirty = false;
let library: Record<string, StoryDecoratorFactory[]> = {};
let libraryReference = new Set<any>();

let newDecorators: StoryDecoratorFactory[] | undefined = undefined;

export const removeAllIncludes = () => {
  libraryIsDirty = true;
  library = {};
  libraryReference = new Set();
};

export const addStoryDecorators = <ReturnType = any>(factory: StoryDecoratorFactory<ReturnType>): void => {
  if (!newDecorators) {
    throw new Error('addStoryDecorators should be called inside default export function');
  }
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
  newDecorators = undefined;
  const decorators = importer();
  const typeDefault = typeof decorators.default;
  if (typeof decorators.default !== 'function') {
    throw new Error(filename + ' default export is expected to be a function, ' + typeDefault + ' given');
  }
  if (!libraryReference.has(decorators)) {
    newDecorators = [];
    decorators.default();
    library[filename] = newDecorators;
    libraryReference.add(decorators);
    libraryIsDirty = true;
    newDecorators = undefined;
  }
};

export const findDecorators = (storyFile: string): StoryDecoratorFactory[] =>
  Object.keys(library)
    .filter((filename) => storyFile.includes(filename))
    .reduce((acc, key) => {
      acc.push(...library[key]);
      return acc;
    }, [] as StoryDecoratorFactory[]);
