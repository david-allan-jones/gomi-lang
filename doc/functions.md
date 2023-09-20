## Functions

Functions in Gomi begin with the `func` keyword followed by an identifier, a comma-separated list of params and finally a block scope that comprises the body of the function. Here is an example.

```
func myFunction(a, b) {
    # Your function code here
}
```
### Implicit Returns

In Gomi, functions implicitly return the last evaluated expression in the function body. There is no need to write an explicit return keyword. Let's take a look at a simple example

```
func addOne(n) {
    n + 1
}
```
In this example, if you were to go on and call this function, it would evaluate to the parameter + 1.
```
addOne(1)   # 2
```

### Nested Functions

You may also declare functions within functions, and even return those functions as values in their own right. Let's build on the previous example.

```
func makeAdder(n) {
    func add(m) {
        m + n
    }
    add
}

let addTwo = makeAdder(2);
const result = addTwo(0);
result      # 2
```
Using nested functions you can implement more advanced concepts like currying, function factories and other constructs.

### Recursion

Gomi also supports recursive functions. Let's look at the classic factorial example.

```
func factorial(n) {
    n == 1
        ? 1
        : n * factorial(n - 1)
}

factorial(4)    # 24
```

### Closures

Every function forms a closure. See the following example.

```
func makeIncrement() {
    let i = 0;
    func increment() {
        i = i + 1
    }
}
const increment = makeIncrement()
increment()     # 1
increment()     # 2
```
Using closures, you can achieve statefulness by composing functions that operate on the variables within.

That's enough on functions. It's time to move on to control flow mechanisms.

[Previous: Variable Declaration](./variable-declaration.md)

[Next: Control Flow](./control-flow.md)