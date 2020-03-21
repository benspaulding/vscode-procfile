# Changelog

## 1.1.4

Fix a bug where the extension was linting file types other than `Procfile`.

## 1.1.3

Fix some parts of the README that were mangled by formatters.

## 1.1.2

Adjust a few more bits of metadata.

## 1.1.1

Fix a few typos in documentation, add some more metadata to package.json, other
nitpicky bits that change nothing.

## 1.1.0

This is a big release for such a tiny file type, but my motivation was to use
TypeScript on a real project and to learn about the VS Code extension API. Enjoy!

- _Hovers_ — Some services, such as Heroku, give special meaning to certain process names. Hovering over those now gives a brief explanation and a link to documentation.
- _Formatting_ — A configurable setting allows the user to choose if there is
  whitespace between the process name and the command. This setting is used for
  formatting while typing, formatting a selected range, and formatting the entire
  document.
- _Diagnostcs_ — Error indicators show if a Procfile has two processes with the same
  name.
- _Symbol navigation_ — all processes are identified and can be navigated with
  breadcrumbs or the command pallete.

## 1.0.0

Recognize process names containing a `-` (dash) as valid. This is based on testing
Foreman and its clones to determine the most common subset of functionality.

## 0.1.1

Add an icon for the extension.

## 0.1.0

Initial release of `vscode-procfile` extension.
