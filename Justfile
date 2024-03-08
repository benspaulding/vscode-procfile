#!/usr/bin/env -S just --justfile

# Config
# ======================================================================

set dotenv-load := true
set ignore-comments := true
set shell := ["fish", "-c"]

# Short names for commonly used functions
FROM := invocation_directory()
HERE := justfile_directory()
SELF := justfile()
SHEL := `test -n "$0" && echo "$0" || basename "$(status fish-path)"`

# Export more explicit names for other scripts to use
export JUST_RUN_PATH := FROM
export JUST_SRC_PATH := HERE
export JUSTFILE := SELF
export JUST_SHELLISH := SHEL

# Handy bits
t := "true"
f := "false"

src_dir := HERE / "src"
ext_dir := HERE / "dist"
out_dir := HERE / "out"

node_dir := HERE / "node_modules"
node_bin := node_dir / ".bin"

venv_dir := env_var_or_default("VIRTUAL_ENV", HERE / ".venv")
venv_bin := venv_dir / "bin"
venv_cfg := venv_dir / "pyvenv.cfg"
venv_act := venv_bin / "activate" + if SHEL =~ '^(fi|c)sh$' { "." + SHEL } else { "" }

pyexe := venv_bin / "python"

export NODE_ENV := env_var_or_default("NODE_ENV", "development")
export PATH := node_bin + ":" + venv_bin + ":" + env_var("PATH")


# Aliases
# ======================================================================

alias h := help
alias i := setup


# Recipes
# ======================================================================

## General
## ---------------------------------------------------------------------

# run this recipe if no arguments are given (by virtue of it being the *first* recipe)
@_default: ls

# list available recipes
@ls:
	"{{ SELF }}" --list --unsorted

# print help info & list available recipes
@help: && ls
	"{{ SELF }}" --help


## Setup
## ---------------------------------------------------------------------

# prep for development
setup: setup-env setup-node setup-venv
	git status

# create & populate .env file
setup-env:
	#!/usr/bin/env fish

	if ! command -q op
		echo "1Password CLI not found; skipping .env setup."
		exit 0
	end
	echo "Creating .env file using 1Password." >&2

	set cmd op inject --account "spaulding.1password.com" -i .env.in
	set tmpenv (mktemp -t .env)
	set msg "Done!"
	set ecode 0

	if [ ! -e .env ]
		$cmd -o .env
	else
		set oldsum (md5sum .env | grep -Eoe '^[a-z0-9]{32}\b')
		set newsum ($cmd | md5sum | grep -Eoe '^[a-z0-9]{32}\b')
		if [ "$oldsum" != "$newsum" ]
			read -P "File .env already exists, overwrite it? [y/N]" overwrite
			if contains (string lower $overwrite) y yes
				$cmd -o .env -f
			else
				set msg "Exiting; did not overwrite existing .env file."
				set ecode 1
			end
		end
	end

	rm $tmpenv
	echo $msg >&2
	exit $ecode

# prep node environment
setup-node:
	npm install

# prep python virtual environment
setup-venv:
	#!/usr/bin/env fish
	test -e "{{ venv_cfg }}"
	or python -m venv .venv
	and source "{{ venv_act }}"
	and "{{ venv_bin / 'python' }}" -m pip install -U --upgrade-strategy=eager pip setuptools wheel
	and "{{ venv_bin / 'python' }}" -m pip install pre-commit==3.6.2
	and "{{ venv_bin / 'pre-commit' }}" install --install-hooks


## Build
## ---------------------------------------------------------------------

# build the extension
build: build-lint build-fmt build-dist

# lint all files
build-lint:
	npm run lint
	source "{{ venv_act }}" && pre-commit run -a

# format all files
build-fmt:
	npm run format

# build extension javascript
build-dist:
	npm run esbuild

# package up as extension
build-ext:
	#!/usr/bin/env fish

	# Package minified extension
	npm run vscode:prepublish

	# Good to review
	npx "@vscode/vsce" ls

	# Should do before running publish, just to be safe
	npx "@vscode/vsce" package


## Publish
## ---------------------------------------------------------------------

# publish extension to all locations
publish: publish-vscode publish-ovsx

# publish extension to VS Code Marketplace
[confirm]
publish-vscode:
	npx "@vscode/vsce" publish --githubBranch "main" -p "$VSCE_TOKEN"

# publish extension to OVSX
[confirm]
publish-ovsx:
	npx ovsx publish --baseImagesUrl "https://github.com/benspaulding/vscode-procfile/raw/main/" -p "$OVSX_TOKEN"



## Clean
## ---------------------------------------------------------------------

# remove development artifacts
clean: clean-dist clean-node clean-venv

# remove built extension files
clean-dist:
	rm -rf "{{ ext_dir }}"
	rm -rf "{{ out_dir }}"

# un-setup node environment
clean-node:
	rm -rf "{{ node_dir }}"

# un-setup python virtual environment
clean-venv:
	#!/usr/bin/env fish
	if test -e "{{ venv_cfg }}"
		source "{{ venv_act }}"
		if command -q pre-commit
			pre-commit clean
			pre-commit gc
			pre-commit uninstall
		end
		deactivate
	end
	rm -rf "{{ venv_dir }}"


## Develop
## ---------------------------------------------------------------------

# watch & build typescript files
watch:
	npm run watch
