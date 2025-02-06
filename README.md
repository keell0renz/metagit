# MetaGit: Never write your commit messages again

MetaGit looks at your `git diff`, and instructs a language model to write a commit message instead of you.

## Usage

### 1. Set environment variables (into your interpreter config)

```sh
export OPENAI_API_KEY=<key>
```

### 2. Install from repository

```sh
npm install -g metagit
```

### 3. Use

> You were cooking something...

```sh
metagit
```

```txt
Added something...

? Proceed (y/n)
```

> If you want to guide...

```sh
metagit some shit fixin the bugs lmao
```

```txt
fix: fixed some bugs at ...
1. ...
2. ...
3. ...

? Proceed (y/n)
```

> If you want to customize...

💡 **Note:** By default it looks for `metagit.json` in current working directory

```sh
metagit --config ../../../my_config_file_elsewhere.json
```

```json
{
    "instructions": "Write commits like this and like that...", // Instructions for AI
    "gitadddot": true, // Whether program does 'git add .' before commit, can be overriden with --noadd or --add in CLI
    "model": "gpt-4o-mini" // AI Model, by default 'gpt-4o-mini'
}
```
