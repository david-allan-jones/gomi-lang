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
bun index.ts path_to_file.gomi
```

## Documentation

### Language Grammar

Here is a specification of the grammar. <> indicates a non-terminal symbol. ϵ indicates the empty string. Anything else is a terminal symbol. For brevity primary expression types like `int` or `string-value` are not be expanded upon as they are pretty self explanation I think.

```
<program>           ->  | <stmt-list> 
                        | ϵ

<stmt-list>         ->  | <stmt><stmt-list>
                        | ϵ

<stmt>              ->  | <module-import>
                        | <var-declaration>
                        | <func-declaration>
                        | <if-stmt>
                        | <while-stmt>
                        | <expr>

<module-import>     ->  | module <string> import { <ids> }

<ids>               ->  | <id>
                        | <id>, <ids>

<var-declaration>   ->  | <mutable-keyword> <ids> = <exprs>;

<mutable-keyword>   ->  | let
                        | const

<func-declaration>  ->  | function <id>(<params>){<stmt-list>}

<params>            ->  | <ids>
                        | ϵ

<if-stmt>           ->  | if <expr>{<stmt-list>}

<while-stmt>        ->  | while <expr>{<stmt-list>}

<exprs>             ->  | <expr>
                        | <expr>, <exprs>

<expr>              ->  | <id> = <expr>
                        | <array-expr>

<array-expr>        ->  | [<exprs>]
                        | <object-expr>

<object-expr>       ->  | { <key-value-pairs> }
                        | <ternary-expr>

<kv-pairs>          ->  | <kv-pair>
                        | <kv-pair>, <kv-pairs>

<kv-pair>           ->  | <id>: <expr>

<ternary-expr>      ->  | <equality-expr> ? <expr> : <expr>

<equality-expr>     ->  | <logical-or-expr>
                        | <logical-or-expr> == <equality-expr>

<logical-or-expr>   ->  | <logical-and-expr>
                        | <logical-and-expr> || <logical-or-expr>

<logical-and-expr>  ->  | <comparison-expr>
                        | <comparison-expr> && <logical-and-expr>

<comparison-expr>   ->  | <additive-expr>
                        | <additive-expr><compare-op><comparison-expr>

<compare-op>        ->  | >
                        | <

<additive-expr>     ->  | <multiply-expr>
                        | <multiply-expr><additive-op><additive-expr>

<additive-op>       ->  | +
                        | -

<multiply-expr>     ->  | <exponent-expr>
                        | <exponent-expr><multiply-op><multiply-expr>

<multiply-op>       ->  | *
                        | /
                        | %

<exponent-expr>         | <unary-expr>
                        | <unary-expr> ^ <exponent-expr>

<unary-expr>            | <unary-op><call-member-expr>
                        | <call-member-expr>

<unary-op>              | !
                        | -

<call-member-expr>      | <member-expr>
                        | <member-expr><call-expr>

<member-expr>           | <primary-expr>
                        | <primary-expr>.<id>
                        | <primary-expr>[<expr>]

<call-expr>             | (<exprs>)<call-expr>
                        | ϵ

<primary-expr>          | <id>
                        | <int>
                        | <float>
                        | <string>
                        | nil
                        | true
                        | false
                        | (<expr>)

<string>            ->  | '<string-value>'

```

### Online Demo

Coming soon!

## Special Thanks

I would like to dedicate this section to everyone who has been a huge help in furthering my own understanding of language design.

* Changwook Kim
* Qi Cheng
* tylerlaceby (https://www.youtube.com/@tylerlaceby)

## Contact

If you like to contact me, please reach out to me through [my website](https://www.davidjonesdev.com/contact).