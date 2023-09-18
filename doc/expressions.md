## Expressions

Because Gomi is an interpreted language, statements are evaluated line by line. This means standalone expressions (without being assigned to variables, etc) are run and converted into values. This will be very important to remember when you learn more about functions.

### Numeric Expressions

There are two different numeric types within Gomi: `int` and `float`. 

An `int` is simply a signed integer and the size of that integer is bound only by your memory. This is accomplished in the interpreter by converting them into Javascript's `bigint` type under the hood. Here are some `int` expressions.

```
1
5 + 5
4 * 3
(9 / 3)
```

When intepreting the language, Gomi will treat any primitive without a dot `.` as an `int` type. If you include a dot, it will be treated as a `float` type. These are represented as Javascript's `number` type under the hood. Here are some `float` expressions.

```
1.0
5.5 + 5.3
4.2 * 3.1
(9.3 / 3.1)
```

**Warning**: This is not a statically typed language, but there will be runtime checks on these types so please do not mix them up. Gomi won't do any kind of type coercion.

### String Expressions

All type `string` literals need to be wrapped in single quotes. You may use `\` as an escape character. Here are some `string` expressions.

```
'This is a Gomi string'
'\'Some famous quote here in quotes\''
```
You may also access individual characters in the string using bracket syntax for array indexing.

```
# Assume the variable s contains 'Gomi'
s[0]    #'G'
```

### Boolean Expressions

These are pretty straight forward. Just use the literals `true` or `false`.

```
true
false
```
### Unary Expressions

Gomi currently supports two kinds of unary expressions, the bang operator and the negative operator. 

First, let's start with the straight-forward bang operator. This just inverts the value of a `boolean` type expressions.

```
!true       #false
```

The negative operator is actually the mechanism used to make numeric values negative and is not inherit to the numeric literals themselves. Treating `-` as a unary operator also has the property of allowing you to use it on identifiers (variables) or even more complex expressions.

```
1 - -1      #2
-(1 + 4)    #-5
```

### Binary Expressions

Of course you can also place operators between expressions. Here are some `int` examples.

```
1 + 2       # 3
3 * 2       # 6
5 % 3       # 2
2 ^ 2 ^ 2   # 16
5 > 4       # true
0 == 0      # true
1 != 0      # true
10 >= 2     # true
```
You see that some of these expressions naturally evaluate to an `int` while others evaluate to a `boolean` type. Be mindful when composing expressions what type you are dealing with.

Gomi also supports logical operators on `boolean` types.

```
true || false # true
true && false # false
true == false # false
true != false # true
```

The binary operators for strings may have some surprising behaviors you are not used to in other programming langauge. Let's take look at some examples.

```
'a' + 'b'       # 'ab'
'aba' - 'a'     # 'ba'
'a' * '*'       # '*a*'
'aba' / 'a'     # 'b'
'aba' == 'aba'  # true
```

### Ternary Expression

Gomi also has a ternary expression. When composing one, ensure the first operand evaluates to a `boolean` type or an error will occur. If it does, then the entire expression will evaluate to the second operand if the first one is true, and the second if it is false.

```
true  ? 1 : 0   # 1
false ? 1 : 0   # 0
```

### Other Types

There are three more types not covered up to this point. They are better left for their own sections. But they are the `object`, `array`, and `void` types. Please read further ahead for more information.

[Next: Variable Declaration](./variable-declaration.md)
