# [1.5.0](https://github.com/mussnad/frappe-react-query/compare/v1.4.0...v1.5.0) (2025-03-13)

### Bug Fixes

-   Correct typos in FrappeProvider type definitions for clarity and consistency ([0b1d9b4](https://github.com/mussnad/frappe-react-query/commit/0b1d9b4619c07cdab268a097987d7d437f020cbd))
-   Rename isValidating to isFetching in README examples for consistency with React Query ([0139475](https://github.com/mussnad/frappe-react-query/commit/0139475a7c81bbd260743cdb4856afdd9a09d35d))
-   Rename isValidating to isFetching in useSearch hook for consistency with React Query ([bccdd56](https://github.com/mussnad/frappe-react-query/commit/bccdd56861e14792db1b46dc116b55565c3158ff))
-   Simplify queryKey in useFrappeAuth hook by removing unnecessary dependencies for improved performance ([77c853a](https://github.com/mussnad/frappe-react-query/commit/77c853a73602d4086113c8eeca64e1d99acee319))
-   Update keywords in package.json for better visibility and include 'hooks' ([d8e14c6](https://github.com/mussnad/frappe-react-query/commit/d8e14c65234d24d5723beb5295c8bb9284ccee25))

### Features

-   Add example usage for Frappe API hooks in useAPI.ts to enhance documentation ([cc67e64](https://github.com/mussnad/frappe-react-query/commit/cc67e645534a663f41d406808731870e2a3c41f6))
-   Add example usage to useFrappeDocumentEventListener and useFrappeDocTypeEventListener for improved documentation clarity ([83c4e1d](https://github.com/mussnad/frappe-react-query/commit/83c4e1d1e77115c578b4a0bc6fcd77bc091aa523))
-   Add example usage to useValidateLink for improved documentation clarity ([7f11072](https://github.com/mussnad/frappe-react-query/commit/7f11072e1d68df654833ffee9b212b8d4d582745))
-   Add React plugin to Vite configuration for improved development experience ([9bc229d](https://github.com/mussnad/frappe-react-query/commit/9bc229d7c0132d7789c1b0628bddb33828c0cfed))
-   Enhance FrappeConfig and FrappeAuthConfig interfaces with realtime user authentication options and update ValidateLinkResponse to accept readonly string arrays ([0f0607b](https://github.com/mussnad/frappe-react-query/commit/0f0607b61f93f48e52b9633127f741e59058638a))
-   Enhance useFrappeAuth hook with additional configurations and improved documentation, including support for realtime user validation and updated user cookie handling ([3f0c64e](https://github.com/mussnad/frappe-react-query/commit/3f0c64e898f21df76a1f0d886ab4d63bf98b89a2))
-   Extend socket.d.ts with TokenParams and Socket imports for enhanced type definitions ([a70feb9](https://github.com/mussnad/frappe-react-query/commit/a70feb95d0d216aeaae5d9c76f03e8137ae93b52))
-   Improve documentation across various hooks and socket class, adding optional parameters and clarifying return types for better developer experience ([6a1864c](https://github.com/mussnad/frappe-react-query/commit/6a1864cee90dc480934b2e78574e976c4956ea8e))
-   Update dependencies in package.json and yarn.lock, including upgrading @mussnad/frappe-js-client to version 1.6.4 and axios to version 1.8.3, while removing unused packages for a cleaner project structure. ([055000a](https://github.com/mussnad/frappe-react-query/commit/055000a05efbcdc3d963e122a66c1d74fdae5809))
-   Update dependencies in package.json and yarn.lock, upgrading eslint, eslint-plugin-react-hooks, lint-staged, typescript-eslint, and vite to their latest versions for improved performance and compatibility ([5de0a1c](https://github.com/mussnad/frappe-react-query/commit/5de0a1c66b337f9972882ca44883f3b7fd3a31d5))
-   Update useDocument hooks to improve documentation and return types, adding example usage for clarity ([cc6384c](https://github.com/mussnad/frappe-react-query/commit/cc6384cf622a4a64f60345039827b95b35781ef5))

# [1.4.0](https://github.com/mussnad/frappe-react-query/compare/v1.3.1...v1.4.0) (2025-03-12)

### Bug Fixes

-   Update dependencies in yarn.lock to latest versions for Babel and axios ([17e1d8c](https://github.com/mussnad/frappe-react-query/commit/17e1d8c651acb19566e10ea6d54ab5a8f348084f))

### Features

-   Update package.json and vite.config.ts for improved build configuration and file structure ([910b5f1](https://github.com/mussnad/frappe-react-query/commit/910b5f1724c362ada0bdafb968c9c31f4e9490f8))

## [1.3.1](https://github.com/mussnad/frappe-react-query/compare/v1.3.0...v1.3.1) (2025-03-12)

### Bug Fixes

-   Enhance README with emoji and refined project description ([069239e](https://github.com/mussnad/frappe-react-query/commit/069239e0b2beb51886749668396bf5597b152a79))

# [1.3.0](https://github.com/mussnad/frappe-react-query/compare/v1.2.1...v1.3.0) (2025-03-12)

### Features

-   Update README with comprehensive documentation for Frappe React Query SDK ([41b063c](https://github.com/mussnad/frappe-react-query/commit/41b063cd8e792e81e15689370cccb0c753d68446))

## [1.2.1](https://github.com/mussnad/frappe-react-query/compare/v1.2.0...v1.2.1) (2025-03-12)

### Bug Fixes

-   Publish package as public npm module ([d58c433](https://github.com/mussnad/frappe-react-query/commit/d58c433385b44390541725b14792ccea68185959))

# [1.2.0](https://github.com/mussnad/frappe-react-query/compare/v1.1.0...v1.2.0) (2025-03-12)

### Features

-   Add semantic-release to package.json and update prepare script ([8214c9f](https://github.com/mussnad/frappe-react-query/commit/8214c9fab12f33d099211a8001977e984d7ac72f))

# [1.1.0](https://github.com/mussnad/frappe-react-query/compare/v1.0.2...v1.1.0) (2025-03-12)

### Bug Fixes

-   Update pre-commit hook to use lint-staged ([45b2a5e](https://github.com/mussnad/frappe-react-query/commit/45b2a5e8ef0b7511422620a95d743a03df40fe8c))

### Features

-   Configure semantic-release for automated versioning and changelog generation ([9c17086](https://github.com/mussnad/frappe-react-query/commit/9c170865f64046b2d9498b06a6bab7137246b376))
