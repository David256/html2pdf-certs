import image from '@rollup/plugin-image'
import css from 'rollup-plugin-import-css'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/main.tsx',
    output: {
        file: 'dist/main.js',
        format: 'es',
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
    },
    external: ['react', 'react-dom', 'html2pdf.js', 'react/jsx-runtime'],
    plugins: [
        css(),
        image(),
        typescript({
            tsconfig: 'tsconfig.json',
        }),
    ],
}