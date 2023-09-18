# Gomi (ゴミ)

Welcome to Gomi (ゴミ), a programming language for those who like Japanese and scripting languages. I wrote this initial implementation in TypeScript because who cares about performance? I sure don't! Well, I cared enough to use Bun as the recommended runtime at least.

To install dependencies:

```bash
bun install
```

## What's Here

### REPL

Within these walls you will find a few things to play around. The first and most important thing for a beginner is the language REPL. You can start it up by running

```bash
bun run repl.ts
```

There are also REPLs that just output the results of the lexing and parsing steps if you are curious. These can found by running `repl-lexer.ts` and `repl-parser.ts` respectively.

### Script Runner

The `index.ts` file of this package is a script runner. You can have the interpreter evalate an arbitrary input source by running

```bash
bun index.ts path_to_file.gomi
```

This file can also be built in Bun into a native binary for improved performance if needed.

## Documentation

1.  [Expressions](./doc/expressions.md)
2.  [Variable Declaration](./doc/variable-declaration.md)
3.  [Functions](./doc/functions.md)
4.  [Control Flow](./doc/control-flow.md)
5.  [Arrays & Objects](./doc/arrays-and-objects.md)
6.  [Runtime Functions](./doc/runtime-functions.md)
7.  [Module Imports](./doc/module-import.md)
8.  [Sample Programs](./doc/sample-programs.md)
9.  [Grammar](./doc/grammar.md)
10. [Japanese Aliases](./doc/japanese-aliases.md)
11. [Contributions](./doc/contributions.md)

## Special Thanks

I would like to dedicate this section to everyone who has been a huge help in furthering my own understanding of language design.

* Changwook Kim
* Qi Cheng
* tylerlaceby (https://www.youtube.com/@tylerlaceby)

## Contact

If you like to contact me, please reach out to me through [my website](https://www.davidjonesdev.com/contact).