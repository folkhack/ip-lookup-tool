# Node.js

This setup will guide you on setting up Node.js via nvm, specifying a project Node.js versions with `.nvmrc`, initializing your `package.json`, and installing core dependencies.

---

### 1. Setup Installing Node.js LTS via nvm

Install nvm (Node Version Manager): https://github.com/nvm-sh/nvm#installing-and-updating

```bash
# Install the latest LTS of Node.js
# - Reinstall previous packages
nvm install --lts --reinstall-packages-from=node

# Set default to most current version of node and use
nvm alias default node
nvm use default

# OPTIONAL: Update global packages (if updating from old version)
# npm update -g
```

---

### 2. Setup Set a project Node.js version with .nvmrc

```bash
# Set current Node.js version in project .nvmrc
# - Alt. example with static version # `echo "v18.17.1" > .nvmrc`
node -v > .nvmrc

# Use project Node.js version
nvm use
```

---

### 3. Setup Initialize Node.js `package.json`

```bash
# Initialize the package (es6 will specify type="module" and it will not prompt you for details)
npm init es6

# Set package.json properties
npm pkg set name="desired_name"
npm pkg set author="fh"
npm pkg set license="NONE"
npm pkg set main="dist/cli.js"
```

##### Other `package.json` properties

You may want to set these other properties by hand:

* `license` - https://choosealicense.com/
* `private` - `true|false`, set to `true` if not intending to share with public
* `engines.node` - Set minimum Node.js version
* `engines.npm` - Set minimum npm version
* `description` - Set an optional description for the project
* `homepage` - Set a webpage for the project (good to use GitHub/GitLab project link)
* `bugs` - Set an issues webpage for the project (good to use GitHub/GitLab project issues link)
* `repository.url` - Set a URL for the project's git repo

---

### 4. Setup Dependencies

* Core dependencies
    - [`dotenv`](https://www.npmjs.com/package/dotenv) - `.env` configuration support
* Dev dependencies
    - [`rimraf`](https://github.com/isaacs/rimraf) - cross-platform rm support (for Windows support)
    - [`cross-env`](https://github.com/kentcdodds/cross-env) - Run scripts that set and use environment variables across platforms (for Windows support)

```bash
npm install dotenv --save
npm install rimraf cross-env --save-dev
```
