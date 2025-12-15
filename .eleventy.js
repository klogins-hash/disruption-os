const dayjs = require('dayjs');

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');

  // Add date filter
  eleventyConfig.addFilter('formatDate', (date) => {
    return dayjs(date).format('MMMM D, YYYY [at] h:mm A');
  });

  eleventyConfig.addFilter('shortDate', (date) => {
    return dayjs(date).format('MMM D, YYYY');
  });

  // Add short hash filter
  eleventyConfig.addFilter('shortHash', (hash) => {
    return hash ? hash.substring(0, 7) : '';
  });

  // Add JSON filter for debugging
  eleventyConfig.addFilter('json', (value) => {
    return JSON.stringify(value, null, 2);
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
