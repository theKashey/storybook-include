/* eslint-disable no-param-reassign */
export function babel(options: { overrides?: any[] } = {}) {
  options.overrides = options.overrides || [];
  options.overrides.push({
    test: /\.stories\.tsx?/,
    plugins: [require.resolve('./babel')],
  });
  return options;
}
