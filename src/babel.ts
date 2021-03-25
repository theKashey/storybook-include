import fs from 'fs';

import { dirname, join, relative, sep } from 'path';

import * as Babel from '@babel/core';
import type { PluginObj } from '@babel/core';

type BabelTypes = typeof Babel;

const tryExtensions = ['ts', 'js', 'tsx', 'jsx'];
const tryNames = tryExtensions.map((ext) => `storybook.include.${ext}`);

const tryFindInclude = (path: string): string | undefined => {
  for (const name of tryNames) {
    const fullPath = join(path, name);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return undefined;
};

const fixRelative = (rel: string): string => (rel[0] === '.' ? rel : `./${rel}`);

function findIncludes(file: string) {
  let path = file;
  const found: Array<[string, string]> = [];
  const context = dirname(file);
  // eslint-disable-next-line no-cond-assign
  while (path.length > 1) {
    const file = tryFindInclude(path);
    if (file) {
      found.push([path + sep, fixRelative(relative(context, file))]);
    }
    path = dirname(path);
  }
  return found;
}

const templateOptions = {
  placeholderPattern: /^([A-Z0-9]+)([A-Z0-9_]+)$/,
};

const plugin = (args: BabelTypes): PluginObj => {
  const { types: t, template } = args;

  return {
    name: 'Storybook Story include',
    visitor: {
      Program: {
        enter(programPath, { file }) {
          const filename = file.opts.filename ?? 'unknown';

          const headerTemplate = template.statement(
            "import { wrapStory, registerStorybookInclude } from 'storybook-include';",
            templateOptions
          );
          const buildTaggerStat = template.statement('wrapStory(VARIABLE, NAME, FILENAME)', templateOptions);
          const importTaggerStat = template.statement(
            'registerStorybookInclude(ABSOLUTE_PATH, () => require(FILENAME))',
            templateOptions
          );

          findIncludes(filename).forEach(([absoluteImport, relativeImport]) => {
            programPath.node.body.unshift(template.statement(`import '${relativeImport}';`, templateOptions)());

            programPath.node.body.push(
              importTaggerStat({
                ABSOLUTE_PATH: t.stringLiteral(absoluteImport),
                FILENAME: t.stringLiteral(relativeImport),
              })
            );
          });

          programPath.node.body.unshift(headerTemplate());

          programPath.traverse({
            ExportNamedDeclaration: (path) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const story = path.node.declaration?.declarations[0].id;
              const block = buildTaggerStat({
                VARIABLE: t.identifier(story.name),
                NAME: t.stringLiteral(story.name),
                FILENAME: t.stringLiteral(filename),
              });
              programPath.node.body.push(block);
            },
          });
        },
      },
    },
  };
};

module.exports = plugin;
