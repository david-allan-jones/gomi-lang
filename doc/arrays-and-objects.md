## Arrays & Objects

The `array` and `object` types are complex types that can be composed of arbitrary values, including other nested `array` or `object` type values. Let's begin with arrays.

### Arrays

An array in Gomi is simply a list of values. These values do not all have to be the same type. To declare an array literall, just use bracket syntax with a list of expressions within.

```
[]                  # Empty array
[1]                 # One int element
['a', 'b', 'c']     # Three string elements
[0, 'error']        # Mix of int and string elements
[[0, 1], [3, 5]]    # Array of arrays (coordinates, etc)
```
To grab an individual value from an array, you can use the bracket index syntax such as below.
```
const arr = ['hello', 'world'];
arr[0]              # 'hello'
arr[1]              # 'world'
arr[2]              # Will result in an error
```
You can even reassign values in an array.
```
let arr = [0, 1, 2];
arr[0] = 'a'
arr[0]              # 'a'
```
However, if a variable is a constant you can not perform such a reassignment.
```
const arr = ['a', 'b'];
arr[0] = 'c'        # Will result in an error
```
When working with arrays, always be mindful of what types you are working with. Avoid mixing up too many types in a way that is unpredictable or you may encounter unexpected errors.

If you need to iterate over an array, you should use the global `len` function. The global functions provided by the runtime will be covered in the next section.

```
let arr = [0, 1, 2, 3, 4, 5];
let i, sum = 0, 0;
while i < len(arr) {
    sum = sum + arr[i]
    i = i + 1
}
sum         # 15
```

### Objects

The `object` type in Gomi is special in that it is the only nullable type. This is to facilitate the development of graph structures including linked lists or trees. To declare an object as nullabe, use the `nil` literal.
```
let pointer = nil;
```
For non-nil objects, they will look very familiar to those who have worked with Javascript. All literals take the form of a block scope containing a comma-separated list of key-value pairs.
```
let obj = {
    name: 'Ken',
    age: 26,
    registered: true
    metadata: {
        version: '3.5.0'
        os: 'Ubuntu'
    }
};
```
You can then access these internal properties using a dot followed by the property name.
```
obj.name                # Ken
obj.age                 # 26
obj.registered          # true
obj.metadata.version    # '3.5.0'
obj.metadata.os         # 'Ubuntu'
```
If you attempt to access a property that does not exist, it will evaluate to `nil`.
```
obj.fakeProp            # nil
```
For mutable objects, you can reassign and add properties freely. If it is a const, however, you will receive an error if you attempt to assign to the property.
```
let mutableObj = { a: 1 };
mutableObj.a = 2

const fixedObj = { a: 1 };
fixedObj.a = 2          # Will result in an error
```
It is a common procedure in programming to use a pointer to walk a graph. This can be achieve with the `object` type and reassigning iteratively.
```
let linkedList = {
    val: 1,
    next: {
        val: 2,
        next: {
            val: 3,
            next: nil
        }
    }
};

let pointer, sum = linkedList, 0;
while pointer != nil {
    sum = sum + pointer.val
    pointer = pointer.next
}

sum             # 6
```
That is enough about objects. It's time to cover some of the global functions provided by the runtime out of the box.

[Previous: Control Flow](./control-flow.md)

[Next: Runtime Functions](./runtime-functions.md)