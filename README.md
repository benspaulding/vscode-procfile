# `Procfile` extension for Visual Studio Code

A [Visual Studio Code][vscode] [extension][vscext] with support for
[`Procfile`s][heroku].

![syntax hilighting](assets/side-by-side.png)

The `Procfile` is mostly known for its use by [Heroku][] and [Foreman][]. However, it
is supported by a number of other services and utilities, and is extremely handy for
development. With this `.env` file:

```dotenv
DJANGO_SETTINGS_MODULE=my_site.settings.local
WEB_HOST=0.0.0.0:8000
BROWSERSYNC_PORT=9000
```

… and this `Procfile`:

```procfile
# Run the Django Web app.
django: django-admin runserver "$WEB_HOST"

# Monitor and rebuild all static/front-end assets.
assets: npm run watch

# Run Browser Sync proxied to the Django Web app.
djsync: browser-sync start --proxy="$WEB_HOST" --port="$BROWSERSYNC_PORT"
```

You can run `honcho start` and have it all up and running!

---

## Features

This extension is _packed_ with features, especially for one that you will hardly
ever have to use! However, I believe both you and the humble `Procfile` deserve only
the best. :)

### Syntax Highlighting

As seen above, the files are highlighted not only to show what a valid process
definition is, but it also highlights the command to run using the shell highlighter.

### Service-Specific Information

Some services, such as Heroku, give special meaning to certain process names.
Hovering over those will now give a description and a link to documentation.

### Formatting

Having whitespace between the process name and the command is optional. This
extension exposes an `insertSpace` (default: `true`) setting to its formatters. All
three types of formatting are provided: on-type, selection, and complete document.

### Diagnostics

A `Procfile` must have unique process names. The extension provides feedback when a
name has been duplicated.

### Symbol Navigation

You have probably never seen a long `Procfile`, but just in case you do, this
extension has you covered! You can navigate through the processes with the
breadcrumbs or the command palette.

---

## Todo

There are still a few things I plan to do.

### Cleanup

- Write tests:
  - core
  - diagnostics
  - formatters
  - hovers
  - symbols
- Clean up core modules (reconsider the Line/Text setup)
- Consider releasing core module as own procfile package

### Features

- Add automatic tasks ([t1], [t2]) for running Procfiles.

[t1]: https://code.visualstudio.com/api/references/vscode-api#TaskProvider
[t2]: https://code.visualstudio.com/api/extension-guides/task-provider

---

## `Procfile` runners: Foreman & Clones

The most used and robust are:

- [Foreman][] (Ruby)
- [Honcho][] (Python)
- [Goreman][] (Go)

Others include:

- [node-foreman][noreman] (Node) _— n.b. How on earth is this not named “Noreman”?
  I insist on referring to it as such!_
- [Shoreman][] (Shell)
- [forego][] (Go)

[vscode]: https://code.visualstudio.com/
[vscext]: https://marketplace.visualstudio.com/VSCode
[heroku]: https://devcenter.heroku.com/articles/procfile
[foreman]: http://ddollar.github.io/foreman/
[honcho]: https://github.com/nickstenning/honcho
[goreman]: https://github.com/mattn/goreman
[noreman]: https://github.com/strongloop/node-foreman
[shoreman]: https://github.com/chrismytton/shoreman
[forego]: https://github.com/ddollar/forego

There is no published standard for `Procfile` syntax, but Foreman can be used as the
reference implementation. Though the various runners recognize different things as
comments, process, or errors, Foreman’s syntax is recognized by this extension.

| _`Procfile`_ | Foreman |   Honcho    | Goreman | Noreman | Shoreman | forego |
| ------------ | :-----: | :---------: | :-----: | :-----: | :------: | :----: |
| `n0: …`      |    ✓    |      ✓      |    ✓    |    ✓    |    ✓     |   ✓    |
| `n1:…`       |    ✓    |      ✓      |    ✓    |    ✓    |    ✗     |   ✓    |
| `n-4: …`     |    ✓    | # [\*](#f1) |    ✓    |    ✓    |    ✓     |   ✓    |
| `# n3: …`    |    #    |      #      |    #    |    #    |    #     |   ✗    |
| `#n4: …`     |    #    |      #      |    #    |    #    |    #     |   ✗    |
| `n5 :…`      |    #    |      #      |    ✓    |    ✗    |    ✓     |   ✗    |
| `n6: …`      |    #    |      #      |    ✓    |    ✗    |    ✓     |   ✗    |
| `n 7: …`     |    #    |      #      |    ✓    |    ✗    |  ✓ / ✗   |   ✗    |
| `n8 : …`     |    #    |      #      |    ✓    |    ✗    |    ✓     |   ✗    |
| `n9 …`       |    #    |      #      |    #    |    ✗    |    ✗     |   ✗    |

| _legend_          |     |
| ----------------- | :-: |
| valid process     |  ✓  |
| ignored / comment |  #  |
| error / hang      |  ✗  |

<a name="f1">\*</a> _Support for dashes is coming to Honcho ([PR #218](https://github.com/nickstenning/honcho/pull/218))._

---

## Release Notes

### 1.1.1

Fix a few typos in documentation, add some more metadata to package.json, other
nitpicky bits that change nothing.

### 1.1.0

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

### 1.0.0

Recognize process names containing a `-` (dash) as valid. This is based on testing
Foreman and its clones to determine the most common subset of functionality.

### 0.1.1

Add an icon for the extension.

### 0.1.0

Initial release of `vscode-procfile` extension.
