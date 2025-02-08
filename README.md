# MetaGit: Never write your commit messages again

MetaGit looks at your `git diff`, and instructs a language model to write a commit message instead of you.

## Usage

### 1. Set environment variables (into your interpreter config)

```sh
export OPENAI_API_KEY=<key>
```

### 2. Install from repository

```sh
npm install -g @keell0renz/metagit
```

### 3. Use

> You were cooking something...

```sh
metagit
```

```txt
Added something...

? Do you want to proceed with this commit message? (Y/n)
```

> If you want to guide...

```sh
metagit some shit fixin the bugs lmao
```

```txt
Commit message...
? Do you want to proceed with this commit message? (Y/n)
```
