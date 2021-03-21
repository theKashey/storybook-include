<div align="center">
  <h1>Storybook Include</h1>
  <br/>
  <img src="./assets/logo.png" alt="storybook include logo" width="200" align="center">
  <br/>
  <br/>
   Controlling decorators in monorepo environments
  <br/> 
  <br/>
  <br/>

  <a href="https://www.npmjs.com/package/storybook-include">
    <img src="https://img.shields.io/npm/v/storybook-include.svg?style=flat-square" />
  </a>

  <a href="https://travis-ci.com/github/theKashey/storybook-include">
    <img src="https://travis-ci.com/theKashey/storybook-include.svg" />
  </a>

  <a href="https://www.npmjs.com/package/storybook-include">
   <img src="https://img.shields.io/npm/dm/storybook-include.svg" alt="npm downloads">
  </a>
 <br/>
</div>

# Idea

Storybook decorators are very powerful, but with great power comes great responsibility.

In the beginning it is ok to define global decorators. But as the project grows, different paths might require different
management or decorators.

Adding these decorators to the every story does not scale from a maintanance point of view.

So, what about **defining decorators on a folder level**?

# Setup

Install this addon by adding the `storybook-include` dependency:

```
yarn add -D storybook-include
```

within .storybook/main.js:

```js
module.exports = {
  addons: ['storybook-include'],
};
```

# Usage

- no changes has to be made to stories, everything can be configured _externaly_

- create a `storybook.include.js`, or `.ts` or `.jsx/.tsx` in a folder. It can be any folder, including your home folder
- configure which decorators has to be included
- it works

# Configuration

Example file

```js
// storybook.include.js
import { addStoryDecorators } from 'storybook-include';

// decorators are defined via default export
export default () => {
  addStoryDecorators((story, { storyName, fileName }) => {
    // you can mutate story
    story.args = { decorated: true };
    // you can add decorators
    story.decorators.push(myDecorator);
    // you can return an array of decorators to add
    return storyName.includes('dark') ? [darkModeDecorator] : undefined;
  });

  // another set
  addStoryDecorators((story, { fileName }) => {
    return fileName.includes('page') ? [ReactRouterDecorator, StaticRouterDecorator] : undefined;
  });

  // another set
  addStoryDecorators((story) => {
    return [CSSInJS, Theme, AndSomethingElse];
  });
};
```

## Reusing configuration

In rare cases you might consider sharing the same configuration between two configuration files.
While simple duplication is usually preferred, there is simpler way to do it

## Note on caching

While storybook does not enforce build caching this plugin is built with it in mind. As a result every file "
autoconfigures" all "include files" above it, and every other file can
"reconfigure" that list.

Theoretically that affects performance for non cached systems.

## See also

- [storybook-csf-title](https://github.com/atlassian-labs/babel-plugin-storybook-csf-title) - a plugin with close semantic - creates `title` for a storybook basing on the location of a story file.

# License

MIT
