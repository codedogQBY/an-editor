import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AnEditorCore',
      fileName: format => `index.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@tiptap/core', '@tiptap/pm', '@tiptap/starter-kit'],
      output: {
        globals: {
          '@tiptap/core': 'TiptapCore',
          '@tiptap/pm': 'TiptapPM',
          '@tiptap/starter-kit': 'TiptapStarterKit',
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});