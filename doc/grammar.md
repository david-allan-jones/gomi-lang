## Grammar

Listed below is a full description of the grammar of the language. 

<> indicates a non-terminal symbol. ϵ indicates the empty string. Anything else is a terminal symbol. For brevity primary expression types like `int` or `string-value` are not be expanded upon as they are pretty self explanation I think.

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

<ternary-expr>      ->  | <logical-or-expr> ? <expr> : <expr>

<logical-or-expr>   ->  | <logical-and-expr>
                        | <logical-and-expr> || <logical-or-expr>

<logical-and-expr>  ->  | <comparison-expr>
                        | <comparison-expr> && <logical-and-expr>

<comparison-expr>   ->  | <additive-expr>
                        | <additive-expr><compare-op><comparison-expr>

<compare-op>        ->  | >
                        | <
                        | >=
                        | <=
                        | ==
                        | !=

<additive-expr>     ->  | <multiply-expr>
                        | <multiply-expr><additive-op><additive-expr>

<additive-op>       ->  | +
                        | -

<multiply-expr>     ->  | <exponent-expr>
                        | <exponent-expr><multiply-op><multiply-expr>

<multiply-op>       ->  | *
                        | /
                        | %

<exponent-expr>     ->  | <unary-expr>
                        | <unary-expr> ^ <exponent-expr>

<unary-expr>        ->  | <unary-op><call-member-expr>
                        | <call-member-expr>

<unary-op>          ->  | !
                        | -

<call-member-expr>  ->  | <primary-expr>
                        | <call-member-expr>.<id>
                        | <call-member-expr>[<expr>]
                        | <call-member-expr>(<exprs>)

<primary-expr>      ->  | <id>
                        | <int>
                        | <float>
                        | <string>
                        | nil
                        | true
                        | false
                        | (<expr>)

<string>            ->  | '<string-value>'

```
