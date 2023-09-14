# Sublime 4 Support

Light-weight alternative to VSCode while still having language support. See inline docs in `*.sublime-project` file for Sublime project-level overrides.

---

### Global LSP, LSP-typescript, eslint Setup:

##### Install LSP and LSP-typescript

* `CTRL + shift + p` > "Install Package"; type ["SublimeLinter"](http://www.sublimelinter.com/en/latest/)
* `CTRL + shift + p` > "Install Package"; type ["SublimeLinter-eslint"](https://github.com/SublimeLinter/SublimeLinter-eslint)
* `CTRL + shift + p` > "Install Package"; type ["LSP"](https://lsp.sublimetext.io/)
* `CTRL + shift + p` > "Install Package"; type ["LSP-typescript"](https://github.com/sublimelsp/LSP-typescript)

##### Update SublimeLinter `linters.eslint.executable` w/current Node.js eslint

* **NOTE:** Will be overridden by local Sublime project settings to use project binary set in `*.sublime-project`
* Open "Preferences" > "Packages Settings" > "SublimeLinter" > "Settings"
* Set `linters.eslint.executable` to the output of the following to ensure Sublime can use eslint:

```bash
which eslint
```

##### Update LSP-typescript `command` w/current Node.js

* **NOTE:** Will be overridden by local Sublime project settings to use project binary set in `*.sublime-project`
* Open "Preferences" > "Packages Settings" > "LSP" > "Servers" > "LSP-typescript"
* Set `linters.eslint.executable` to the output of the following to ensure Sublime can use eslint
    - Use `which node` on Linux to figure out Node.js path
    - Windows default Node.js path is `C:\Program Files\nodejs\node.exe`

---

### Project `.sublime-project` Setup:

##### `.sublime-project` overrides

This project employs a `.sublime-project` file that overrides the package settings/configs - configuring the language server (LSP), or linting (eslint) should be done here on a per-project basis.

**IMPORTANT!** Use the `.sublime-project` to launch the project or overrides will not be properly set.

##### Windows Development Support

For Windows support you will need to update the `*.sublime-project` paths for the the main Node.js executable for LSP, and npx for eslint; there are examples in the configuration file for a standard Node.js install on Windows at the location `C:\Program Files\nodejs`

##### Misc. Debugging Notes

* To debug linter/etc. errors use the console with `CTRL + \``
* Use `print('\n'*100)` in the Sublime console to clear the output when testing
