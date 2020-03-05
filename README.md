# `Procfile` extension for Visual Studio Code

A [Visual Studio Code][VSCode] [extension][VSCext] with support for
[`Procfile`s][Heroku].

![syntax hilighting](support/side-by-side.png)

The `Procfile` is mostly know for its use by [Heroku][] and [Foreman][]. However it
supported by a number of other services and utilities, and is extremely handy for
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

## Foreman & Other Clones

- [Foreman][] (Ruby)
- [Honcho][] (Python)
- [Goreman][] (Go)
- [node-foreman][noreman] (Node)
- [forego][] (Go)

[VSCode]: https://code.visualstudio.com/
[VSCext]: https://marketplace.visualstudio.com/VSCode
[Heroku]: https://devcenter.heroku.com/articles/procfile
[Foreman]: http://ddollar.github.io/foreman/
[Honcho]: https://github.com/nickstenning/honcho
[Goreman]: https://github.com/mattn/goreman
[noreman]: https://github.com/strongloop/node-foreman
[forego]: https://github.com/ddollar/forego

## Known Issues

The `Procfile` grammar in this extension is currently modeled after [Honcho]’s
parsing of `Procfile`s. Testing may be done in the future to be sure it hilights
syntax that works for various process runners.

## Release Notes

### 0.1.0

Initial release of `vscode-procfile` extension.
