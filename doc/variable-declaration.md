## Variable Declaration

Variable declaration in Gomi behaves almost exactly the same as it does in Javascript if you are familiar with that language. In Gomi, there are only two keyword: `let` and `const`. They do basically exactly what they sound like. `let` makes a variable mutable while `const` does not. Unlike Javascript however these mutability characteristics extend to things like the properties of `object` types and `array` types. Read ahead for more on those.

Another thing to keep in mind is all variable declarations in Gomi must end in a semicolon. This is not true for any other kind of statement. If you forget this semicolon you will receive an error.

Here are some examples of variable declaration.

```
let n = 1;
const featureEnabled = false;
const canAccess = authorized && isAdmin;
```
Notice how you can provide expressions on the right hand side including other variables.

### Multiple Declarations

In Gomi, you can also declare multiple variables in a single statement. When doing so, just separate both your identifiers on the left side and the expression on the right side with a comma.

```
let i, j = 0, 1;
i                   # 0
j                   # 1

const n, m = i + 1, j + 1;
n                   # 1
m                   # 2
```
When using the `let` or `const` keyword in multiple declarations, the mutability extends to all identifiers in the statement. So in the above examples, `i` and `j` are mutable while `n` and `m` are not.

That's about all there is to cover with assigning variables. Now it's time to move on to functions.

[Previous: Expressions](./expressions.md)

[Next: Functions](./functions.md)