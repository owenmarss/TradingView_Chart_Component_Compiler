import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import postcssUrl from 'postcss-url';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';

// Check if we are in development mode (dev server)
const isDevelopment = process.env.ROLLUP_WATCH;
const generateHtml = () => ({
    name: 'generate-html',
    buildStart() {
        this.addWatchFile('src/index.html');
    },
    generateBundle(_, bundle) {
        const sourceHtml = readFileSync('src/index.html', 'utf-8');
        const scriptTags = Object.keys(bundle)
            .filter(fileName => fileName.endsWith('.js'))
            .map(fileName => `<script src="${fileName}"></script>`)
            .join('\n');

        const finalHtml = sourceHtml
            .replace('</body>', `${scriptTags}\n</body>`);
        writeFileSync(path.resolve('dist/index.html'), finalHtml);
    }
});

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        sourcemap: isDevelopment ? 'inline' : false,
    },
    plugins: [
        // Resolves node modules
        nodeResolve(),

        url({
            limit: Infinity,
            include: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
        }),

        postcss({
            extract: false, // Inlines CSS in the JS bundle
            modules: false,
            use: ['sass'],
            plugins: [
                postcssUrl({
                    url: 'inline', // Converts font URLs to Base64 inline
                }),
            ],
        }),

        generateHtml(),

        // For production builds, minify the code
        !isDevelopment && terser(),

        replace({
            preventAssignment: true,
            values: {
                'https://www.tradingview.com/?utm_medium=lwc-link&utm_campaign=lwc-chart': '#',
                '_blank': '_self',
            },
        }),

        // For development, start a server and enable live reload
        isDevelopment && serve({
            contentBase: 'dist', // Folder to serve
            port: 10001,
            open: true, // Automatically open in browser
        }),

        isDevelopment && livereload('dist'), // Watch the 'dist' directory
    ],
};
