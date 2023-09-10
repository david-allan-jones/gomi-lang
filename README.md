# Gomi (ゴミ)

Welcome to Gomi (ゴミ), a programming language for those who like Japanese and writing trash. This language is not for the faint of heart. I wrote this initial implementation in TypeScript because who cares about performance? I sure don't! Well, I cared enough to use Bun as the recommended runtime at least.

To install dependencies:

```bash
bun install
```

## What's Here

### REPL

Within these walls you will find a few things to play around. The first and most important thing is the language REPL. You can start it up by running

```bash
bun run repl.ts
```

There are also REPLs that just output the results of the lexing and parsing steps. These can found by running `repl-lexer.ts` and `repl-parser.ts` respectively.

### Script Runner

The `index.ts` file of this package is a script runner. You can have the interpreter evalate an arbitrary input source by running

```bash
bun run index.ts path_to_file.gomi
```

## Documentation

Coming soon!

## Special Thanks

I would like to dedicate this section to everyone who has been a huge help in furthering my own understanding of language design.

* tylerlaceby (https://www.youtube.com/@tylerlaceby)

## Contact

If you like to contact me, please reach out to me through [my website](https://www.davidjonesdev.com/contact).