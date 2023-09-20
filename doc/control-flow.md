## Control Flow

Control flow structures create decision points that will determine what code will execute next. Here are all the control flow structures in Gomi.

### If Statement

To write an if statement in Gomi, simply write `if` followed by a boolean evalauated expression, and finally a block scope for the body of the if statement.

```
func handleStatus(status) {
    if status == 'pending' || status == 'blocked' {
        let message = 'Your status is: ' + status
        outputStatus(message)
    }
}
```
Notice you can write arbitrarily complex expressions without enclosing the whole expression in parentheses.

### While Statement

The only control flow mechanism for iteration in Gomi is the `while` statement. Similar to if statements, just use the `while` keyword followed by a boolean expression and finally a block scope.

```
func sumUpTo(n) {
    let i, sum = 1, 0;
    while i <= n {
        sum = sum + i
        i = i + 1
    }
    sum
}
sumUpTo(3)  # 6
```
Notice because this is a while loop, you need to be careful to update any necessary variables to ensure the loop will halt.

And that's all of the control structures currently supported in Gomi! Let's move on to the more complex data types.

[Previous: Functions](./functions.md)

[Next: Arrays & Objects](./arrays-and-objects.md)