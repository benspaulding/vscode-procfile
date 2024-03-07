# `Procfile` extension for Visual Studio Code

A [Visual Studio Code][vscode] [extension][vscext] with support for
[`Procfile`s][heroku].

![syntax hilighting](assets/side-by-side.png)

The `Procfile` is mostly known for its use by [Heroku][] and [Foreman][]. However, it is
supported by a number of other services and utilities, and is extremely handy for
development.

## Features

This extension is _packed_ with features, especially for one that you will hardly ever
have to use! However, I believe both you and the humble `Procfile` deserve only the
best. :)

### Syntax Highlighting

As seen above, within Procfiles the names of valid process definitions are highlighted.
The process values are also highlighted as shell commands.

### Service-Specific Information

Some services, such as Heroku, give special meaning to certain process names. Hovering
over those will now give a description and a link to documentation.

### Formatting

Having whitespace between the process name and the command is optional. This extension
exposes an `insertSpace` (default: `true`) setting to its formatters. All three types of
formatting are provided: on-type, selection, and complete document.

### Diagnostics

A `Procfile` must have unique process names. The extension provides feedback when a name
has been duplicated.

### Symbol Navigation

You have probably never seen a long `Procfile`, but just in case you do, this extension
has you covered! You can navigate through the processes via breadcrumbs or the command
palette.

## Release Notes

See the [changelog](./CHANGELOG.md).

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

## `Procfile` example

As an example of how handy a Procfile can be, with this `.env` file:

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

… you can run `honcho start` and have it all up and running!

## `Procfile` runners: Foreman & Clones

The most used and robust are:

- [Foreman][] (Ruby)
- [Honcho][] (Python)
- [Goreman][] (Go)

Others include:

- [node-foreman][noreman] (Node) _— n.b. How on earth is this not named “Noreman”? I
  insist on referring to it as such!_
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

| _`Procfile`_ | Foreman | Honcho | Goreman | Noreman | Shoreman | forego |
| ------------ | :-----: | :----: | :-----: | :-----: | :------: | :----: |
| `n0:·…`      |    ✓    |   ✓    |    ✓    |    ✓    |    ✓     |   ✓    |
| `n1:…`       |    ✓    |   ✓    |    ✓    |    ✓    |    ✗     |   ✓    |
| `n-4:·…`     |    ✓    |   ✓    |    ✓    |    ✓    |    ✓     |   ✓    |
| `# n3:·…`    |    #    |   #    |    #    |    #    |    #     |   ✗    |
| `#n4:·…`     |    #    |   #    |    #    |    #    |    #     |   ✗    |
| `n5·:…`      |    #    |   #    |    ✓    |    ✗    |    ✓     |   ✗    |
| `·n6:·…`     |    #    |   #    |    ✓    |    ✗    |    ✓     |   ✗    |
| `n·7:·…`     |    #    |   #    |    ✓    |    ✗    |  ✓ / ✗   |   ✗    |
| `n8·:·…`     |    #    |   #    |    ✓    |    ✗    |    ✓     |   ✗    |
| `n9·…`       |    #    |   #    |    #    |    ✗    |    ✗     |   ✗    |

| _legend_          |     |
| ----------------- | :-: |
| valid process     |  ✓  |
| ignored / comment |  #  |
| error / hang      |  ✗  |
