## Module Imports

Currently, Gomi does support module imports but the module resolution algorithm is a bit simplistic. Basically, you can import a module in your code with the following statement.

```
module './path/to/module.gomi' import { someId }
```
Unlike some programming languages, this module import statement can appear anywhere in a file. When the interpreter reaches this line, what it will do is load the file specified by the path, execute that file line by line, and then move over all the specified identifiers into the current scope. Let's take a look at an example. Imagine you had a module that declared the following function.

```
# linkedListLen.gomi

func linkedListLen(node) {
    let pointer, length = node, 0;
    while pointer != nil {
        length = length + 1
        pointer = pointer.next
    }
    length
}
```
Now imagine I want to reuse this function in another file. The way I would do this is through the following module import.
```
# myFile.gomi

module './linkedListLen.gomi' import { linkedListLen }

const myList = {
    next: {
        next: nil
    }
}

linkedListLen(myList)       # 2
```
Gomi does not have any explicit module export keywords like some languages. Any identifier (including functions or other values) declared at the top level of a file are exported by that file as far as the runtime is concerned. If you care about minimizing the identifiers exported from a file, take care to organize your code in a way where you can accomplish that.

### The GOMI_PATH Environment Variable

In the current implementation of the runtime, all paths declared in a module import are relative to the `GOMI_PATH` environment variable. For example, let's imagine my environment variable is set to `/home/my-user/modules`. Then the following
```
module '/path/to/module.gomi' import { myFunction }
```
Would look for a file at `/home/my-user/modules/path/to/module.gomi`, execute that Gomi file line by line and then finally copy the identifier values into the current scope.

### Conclusion

We've basically arrived at the end of the documentation! The remaining sections will include information you don't necessarily need to get started making interesting programs. Have fun!

If you would like to dig a little deeper, the next section will contain a description of the entire Gomi grammar.

[Previous: Runtime Functions](./runtime-functions.md)

[Next: Grammar](./grammar.md)