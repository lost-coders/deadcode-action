# GitHub Action for deadcode

This repository holds the GitHub Action for deadcode.

The [deadcode](https://pkg.go.dev/golang.org/x/tools/cmd/deadcode) command
reports unreachable functions in Go programs. See details on
[Go's support for finding unreachable functions](https://go.dev/blog/deadcode).

The deadcode GitHub Action is currently experimental and is under active
development.

## Using the deadcode GitHub Action

To use the deadcode GitHub Action add the following step to your workflow:

```yml
- id: deadcode
  uses: lost-coders/deadcode-action@v1
```

By default, the deadcode Github Action will run with the
[latest version of Go](https://go.dev/doc/install) and analyze all packages in
the provided Go module. Assuming you have the latest Go version installed
locally, this is equivalent to running the following on your command line:

```sh
deadcode ./...
```

To specify a specific Go version, directory in which to run deadcode, or
[package pattern](https://pkg.go.dev/cmd/go#hdr-Package_lists_and_patterns),
use the following syntax:

```yml
- id: deadcode
  uses: lost-coders/deadcode-action@v1
  with:
    go-version: <your-Go-version>
    go-package: <your-package-pattern>
```

For example, the code snippet below runs deadcode against a repository on every
push:

```yml
on: [push]

jobs:
  deadcode_job:
    runs-on: ubuntu-latest
    name: Run deadcode
    steps:
      - id: deadcode
        uses: lost-coders/deadcode-action@v1
        with:
          go-version: "1.21"
          go-package: "./..."
```

deadcode Github Action accepts several other optional inputs:

```yml
repo-checkout: checkout the repository, default true
check-latest: check for the latest Go version, default false
go-version-file: go.mod or go.work file specifying Go version, default ""
cache: cache the Go version, default true
flags: flags to run with deadcode, default ""
```

The precedence for inputs `go-version`, `go-version-file`, and `check-latest`
specifying the Go version inherits from
[actions/setup-go](https://github.com/actions/setup-go).

When a dead function is detected, an error will display for that
[GitHub job](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)
regarding the identified function.

## License

Unless otherwise noted, the source files fall under the BSD-style license found
in the [LICENSE](LICENSE) file.
