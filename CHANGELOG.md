## [1.6.1](https://github.com/dhiashalabi/frappe-react-query/compare/v1.6.0...v1.6.1) (2025-06-20)

### Bug Fixes

- update import paths for Frappe types to use the correct package name ([53114f4](https://github.com/dhiashalabi/frappe-react-query/commit/53114f4e759013776ed78dab6c7b2dc58ced3fc9))

# [1.6.0](https://github.com/mussnad/frappe-react-query/compare/v1.5.0...v1.6.0) (2025-03-22)

### Bug Fixes

- add generic type parameters to useQuery in useGetCount for improved type safety ([c0199b7](https://github.com/mussnad/frappe-react-query/commit/c0199b7eeef177e44330f6097846010a04db3491))
- add permissions to FrappeProvider for enhanced context initialization ([627bfda](https://github.com/mussnad/frappe-react-query/commit/627bfdac253ed011a3f898bd15f16c4a0d9178d3))
- enhance type safety by adding TypedResponse to API hooks ([6ec2f60](https://github.com/mussnad/frappe-react-query/commit/6ec2f6017ed975607fa1e65e40cde979cf717877))
- enhance type safety in document hooks by updating type parameters to use FrappeDoc ([5fc3035](https://github.com/mussnad/frappe-react-query/commit/5fc303592cb95b9d4377ac20ae8d1ed187d06bc5))
- improve type safety in useFrappeAuth by refining error handling and adding authResponse ([398caaf](https://github.com/mussnad/frappe-react-query/commit/398caafc925096cd08a00c47b92bca2e4aca6673))
- initialize FrappeContext with an empty FrappeConfig for better type safety ([55dbdbf](https://github.com/mussnad/frappe-react-query/commit/55dbdbf6b6b456022b6b1238904b60c3f641ff20))
- refine type definitions in useFrappeFileUpload for improved type safety ([d0bd02c](https://github.com/mussnad/frappe-react-query/commit/d0bd02c1df56bab6972560ee1880d1be9bb671ff))
- remove unnecessary type assertions in useFrappe hooks for improved type safety ([f554d57](https://github.com/mussnad/frappe-react-query/commit/f554d57598b0b73e206710e749e27e3064e13321))
- remove unused hooks from index.ts to streamline exports ([45be843](https://github.com/mussnad/frappe-react-query/commit/45be843a89af8ebfb5f82a0e3d272ec00c891ee8))
- remove unused type import in useSearch hook for cleaner code ([9300944](https://github.com/mussnad/frappe-react-query/commit/9300944b6d383af2cdf188d35c032ac37c5fdeca))
- remove unused type import in useSocket hook for cleaner code ([fae6dd4](https://github.com/mussnad/frappe-react-query/commit/fae6dd4faf089d5f5f9293f6a82b3f349abe51df))
- reorganize type imports in index.ts for improved clarity and consistency ([321bb47](https://github.com/mussnad/frappe-react-query/commit/321bb4710c6c739b2c25db2b8d674c186f22e900))
- simplify query string construction in getDocListQueryString and getDocCountQueryString for improved readability ([b88e850](https://github.com/mussnad/frappe-react-query/commit/b88e850e5ebe484657d284c940aab9df24d21b74))
- simplify useValidateLink hook by using FrappeDocument and updating query function ([debff04](https://github.com/mussnad/frappe-react-query/commit/debff04f8619d295ad1fca6dc61784f037cfc518))
- update type definitions in useGetList and useGetDoc to use FrappeDoc for improved type safety ([c5680ba](https://github.com/mussnad/frappe-react-query/commit/c5680ba33e33b20fec8c2a111ebde32456c8da4a))
- update type import in useValidate hook to use FrappeDoc for improved type safety ([a958eb6](https://github.com/mussnad/frappe-react-query/commit/a958eb67ab93bd3e58f328cbe3cb0d6ebb397039))

### Features

- add client and permissions to FrappeProvider for enhanced functionality ([e908c4e](https://github.com/mussnad/frappe-react-query/commit/e908c4ed87982fab21bbead7d09a69a43507b2c1))
- add Count component to display user count and integrate with existing user validation and listing components ([017bcc2](https://github.com/mussnad/frappe-react-query/commit/017bcc21c9994ac86c688d1a6141cef0e1c82f01))
- add documentation for query string functions in utils to improve code clarity ([a6b6dbe](https://github.com/mussnad/frappe-react-query/commit/a6b6dbec7258f6442e0b31b46badb7fa5b3f6c22))
- add FrappeClient and GetCountResponse type to enhance type definitions ([0d74cd0](https://github.com/mussnad/frappe-react-query/commit/0d74cd07cb6d23772b1cb79364a28b8245022419))
- add getDocCountQueryString function for query string generation ([4f7f1aa](https://github.com/mussnad/frappe-react-query/commit/4f7f1aa88f964679aeb420aa96c7ef8bb6825d61))
- add useFrappeClient hook to provide access to Frappe client instance ([5c41c02](https://github.com/mussnad/frappe-react-query/commit/5c41c0259a9c518fb9c4ed754558ff5e823b25d9))
- add useGetList, useGetCount, and useGetDoc hooks for Frappe database interactions ([59b5411](https://github.com/mussnad/frappe-react-query/commit/59b5411df57d76cbc4a9076a9a3593c7cacb67b4))
- enhance useFrappe hooks with improved type definitions and error handling ([c3ae6f2](https://github.com/mussnad/frappe-react-query/commit/c3ae6f23b0d4c9d8ebc42c6a1e869b4e0a619c7c))
- export useGetList, useGetCount, and useGetDoc hooks from useClient for improved Frappe interactions ([b7043e9](https://github.com/mussnad/frappe-react-query/commit/b7043e9a26f47ec211bf2e7ae7c0c960350297c4))
- update dependencies to latest versions including @mussnad/frappe-js-client to 2.3.6, @octokit/openapi-types to 24.2.0, and @tanstack/query-core to 5.69.0 ([f7460d1](https://github.com/mussnad/frappe-react-query/commit/f7460d10504aed78ca01620e9c6e5fb9ec43af2b))

# [1.5.0](https://github.com/mussnad/frappe-react-query/compare/v1.4.0...v1.5.0) (2025-03-13)

### Bug Fixes

- Correct typos in FrappeProvider type definitions for clarity and consistency ([0b1d9b4](https://github.com/mussnad/frappe-react-query/commit/0b1d9b4619c07cdab268a097987d7d437f020cbd))
- Rename isValidating to isFetching in README examples for consistency with React Query ([0139475](https://github.com/mussnad/frappe-react-query/commit/0139475a7c81bbd260743cdb4856afdd9a09d35d))
- Rename isValidating to isFetching in useSearch hook for consistency with React Query ([bccdd56](https://github.com/mussnad/frappe-react-query/commit/bccdd56861e14792db1b46dc116b55565c3158ff))
- Simplify queryKey in useFrappeAuth hook by removing unnecessary dependencies for improved performance ([77c853a](https://github.com/mussnad/frappe-react-query/commit/77c853a73602d4086113c8eeca64e1d99acee319))
- Update keywords in package.json for better visibility and include 'hooks' ([d8e14c6](https://github.com/mussnad/frappe-react-query/commit/d8e14c65234d24d5723beb5295c8bb9284ccee25))

### Features

- Add example usage for Frappe API hooks in useAPI.ts to enhance documentation ([cc67e64](https://github.com/mussnad/frappe-react-query/commit/cc67e645534a663f41d406808731870e2a3c41f6))
- Add example usage to useFrappeDocumentEventListener and useFrappeDocTypeEventListener for improved documentation clarity ([83c4e1d](https://github.com/mussnad/frappe-react-query/commit/83c4e1d1e77115c578b4a0bc6fcd77bc091aa523))
- Add example usage to useValidateLink for improved documentation clarity ([7f11072](https://github.com/mussnad/frappe-react-query/commit/7f11072e1d68df654833ffee9b212b8d4d582745))
- Add React plugin to Vite configuration for improved development experience ([9bc229d](https://github.com/mussnad/frappe-react-query/commit/9bc229d7c0132d7789c1b0628bddb33828c0cfed))
- Enhance FrappeConfig and FrappeAuthConfig interfaces with realtime user authentication options and update ValidateLinkResponse to accept readonly string arrays ([0f0607b](https://github.com/mussnad/frappe-react-query/commit/0f0607b61f93f48e52b9633127f741e59058638a))
- Enhance useFrappeAuth hook with additional configurations and improved documentation, including support for realtime user validation and updated user cookie handling ([3f0c64e](https://github.com/mussnad/frappe-react-query/commit/3f0c64e898f21df76a1f0d886ab4d63bf98b89a2))
- Extend socket.d.ts with TokenParams and Socket imports for enhanced type definitions ([a70feb9](https://github.com/mussnad/frappe-react-query/commit/a70feb95d0d216aeaae5d9c76f03e8137ae93b52))
- Improve documentation across various hooks and socket class, adding optional parameters and clarifying return types for better developer experience ([6a1864c](https://github.com/mussnad/frappe-react-query/commit/6a1864cee90dc480934b2e78574e976c4956ea8e))
- Update dependencies in package.json and yarn.lock, including upgrading @mussnad/frappe-js-client to version 1.6.4 and axios to version 1.8.3, while removing unused packages for a cleaner project structure. ([055000a](https://github.com/mussnad/frappe-react-query/commit/055000a05efbcdc3d963e122a66c1d74fdae5809))
- Update dependencies in package.json and yarn.lock, upgrading eslint, eslint-plugin-react-hooks, lint-staged, typescript-eslint, and vite to their latest versions for improved performance and compatibility ([5de0a1c](https://github.com/mussnad/frappe-react-query/commit/5de0a1c66b337f9972882ca44883f3b7fd3a31d5))
- Update useDocument hooks to improve documentation and return types, adding example usage for clarity ([cc6384c](https://github.com/mussnad/frappe-react-query/commit/cc6384cf622a4a64f60345039827b95b35781ef5))

# [1.4.0](https://github.com/mussnad/frappe-react-query/compare/v1.3.1...v1.4.0) (2025-03-12)

### Bug Fixes

- Update dependencies in yarn.lock to latest versions for Babel and axios ([17e1d8c](https://github.com/mussnad/frappe-react-query/commit/17e1d8c651acb19566e10ea6d54ab5a8f348084f))

### Features

- Update package.json and vite.config.ts for improved build configuration and file structure ([910b5f1](https://github.com/mussnad/frappe-react-query/commit/910b5f1724c362ada0bdafb968c9c31f4e9490f8))

## [1.3.1](https://github.com/mussnad/frappe-react-query/compare/v1.3.0...v1.3.1) (2025-03-12)

### Bug Fixes

- Enhance README with emoji and refined project description ([069239e](https://github.com/mussnad/frappe-react-query/commit/069239e0b2beb51886749668396bf5597b152a79))

# [1.3.0](https://github.com/mussnad/frappe-react-query/compare/v1.2.1...v1.3.0) (2025-03-12)

### Features

- Update README with comprehensive documentation for Frappe React Query SDK ([41b063c](https://github.com/mussnad/frappe-react-query/commit/41b063cd8e792e81e15689370cccb0c753d68446))

## [1.2.1](https://github.com/mussnad/frappe-react-query/compare/v1.2.0...v1.2.1) (2025-03-12)

### Bug Fixes

- Publish package as public npm module ([d58c433](https://github.com/mussnad/frappe-react-query/commit/d58c433385b44390541725b14792ccea68185959))

# [1.2.0](https://github.com/mussnad/frappe-react-query/compare/v1.1.0...v1.2.0) (2025-03-12)

### Features

- Add semantic-release to package.json and update prepare script ([8214c9f](https://github.com/mussnad/frappe-react-query/commit/8214c9fab12f33d099211a8001977e984d7ac72f))

# [1.1.0](https://github.com/mussnad/frappe-react-query/compare/v1.0.2...v1.1.0) (2025-03-12)

### Bug Fixes

- Update pre-commit hook to use lint-staged ([45b2a5e](https://github.com/mussnad/frappe-react-query/commit/45b2a5e8ef0b7511422620a95d743a03df40fe8c))

### Features

- Configure semantic-release for automated versioning and changelog generation ([9c17086](https://github.com/mussnad/frappe-react-query/commit/9c170865f64046b2d9498b06a6bab7137246b376))
