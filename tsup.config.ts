import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./packages/index.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    sourcemap: false,
    clean: true,
    treeshake: true,
    cjsInterop: true,
    external: ['dayjs'],
    outExtension({ format }) {
        return {
            js: format === 'cjs' ? '.cjs' : '.js',
        };
    },
});
