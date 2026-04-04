# Releases

## Channels

- `latest` publishes stable releases from `main`.
- `pr` publishes ordinary pull request previews as snapshot versions.
- `rc` publishes release candidate builds from branches prefixed with `rc/`.

## Release Config

- `release.yml` file in root to document policy hat automation can reference.
- Records the PR snapshot version format.
- Records the active RC branch when one exists.

## PR Previews

- Ordinary pull requests publish snapshot versions.
- Snapshot versions include the pull request number, branch name, and a short commit hash.
- A version may look like `1.4.3-pr.128.my-branch.ab12`.
- The `pr` dist tag points to the most recently published ordinary PR preview.
- Consumers should use the exact snapshot version when they need a specific PR build.

## Release Candidates

- Branches prefixed with `rc/` publish ordered release candidate versions.
- RC versions use a format such as `2.0.0-rc.1`.
- The `rc` dist tag points to the current release candidate line.
- Only one active RC line should publish to `rc` at a time.

## Stable Releases

- `main` remains the stable release channel.
- Pushes to `main` validate and publish stable releases to `latest`.
