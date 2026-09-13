import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** Bans `import { Foo as Bar }`. esquery cannot compare two fields on the same node. */
const noImportAlias = {
    meta: {
        type: 'problem',
        docs: { description: 'Disallow renaming named imports' },
        schema: [],
        messages: {
            noAlias:
                'Import types and values under their exported names. Disambiguate with parameter names, not import aliases.',
        },
    },
    create(context) {
        return {
            ImportSpecifier(node) {
                const importedName = node.imported.type === 'Identifier' ? node.imported.name : node.imported.value
                if (importedName !== node.local.name) {
                    context.report({ node: node.local, messageId: 'noAlias' })
                }
            },
        }
    },
}

export default tseslint.config(
    { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'playground/dist/**'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2020,
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            perfectionist,
        },
        settings: {
            react: { version: '19.2' },
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'off',
            'react/prop-types': 'off',
            'perfectionist/sort-imports': [
                'error',
                {
                    type: 'natural',
                    order: 'asc',
                    useExperimentalDependencyDetection: false,
                    groups: [
                        'type-import',
                        ['value-builtin', 'value-external'],
                        'type-internal',
                        'value-internal',
                        ['type-parent', 'type-sibling', 'type-index'],
                        ['value-parent', 'value-sibling', 'value-index'],
                    ],
                },
            ],
            'perfectionist/sort-named-imports': ['error', { type: 'natural', order: 'asc' }],
            'perfectionist/sort-exports': ['error', { type: 'natural', order: 'asc' }],
            'perfectionist/sort-named-exports': ['error', { type: 'natural', order: 'asc' }],
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        plugins: {
            local: { rules: { 'no-import-alias': noImportAlias } },
        },
        rules: {
            'local/no-import-alias': 'error',
        },
    },
    {
        files: ['playground/**/*.{ts,tsx}'],
        ignores: ['playground/components/ui/**'],
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
    eslintConfigPrettier,
)
