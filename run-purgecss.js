// run-purgecss.js
const { PurgeCSS } = require('purgecss');

(async () => {
  try {
    const purgeCSSResults = await new PurgeCSS().purge({
      content: ['src/**/*.html', 'src/**/*.js'],
      css: ['dist/**/*.css'],
      safelist: []
    });

    // Save results
    purgeCSSResults.forEach((result, index) => {
      const fs = require('fs');
      fs.writeFileSync(`dist/cleaned-${index}.css`, result.css);
    });
    
    console.log('PurgeCSS completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
})();