## Runtime Functions

The Gomi interpreter's runtime provides a suite of functions out of the box. These functions are all considered non-mutable so if you attempt to reassign them you will receive an error.

Here are all the global functions:

### Arrays
`len(arr)`:

Takes an array and provides the length of it.
```
len([])         # 0
len([1, 2, 3])  # 3
```

`range(start, stop, step)`:

Takes 3 `int` arguments, with the 3rd `step` argument being optional. It provides an array filled with all the numbers ranging from `start` until but not including `stop`, incrementing by `step` each time. `step` is set to 1 when it is not provided.
```
range(0, 5)     # [0, 1, 2, 3, 4]
range(1, 5, 2)  # [1, 3]
```

`append(arr, el)`:

Takes an array `arr` and some other value `el`. It simply adds `el` to the end of the array.
```
append([], 1)       # [1]
append([1], 'a')    # [1, 'a']
```

`slice(arr, start, stop)`:

Provides a section of an array `arr` including the index `start` up to but not including the index `stop`. If `stop` is not provided, it will take every element from `start` to the end of the array.
```
slice([0, 1, 2], 1)     # [1, 2]
slice([0, 1, 2], 0, 1)  # [0]
```

### Math

`floor(float)`:

Returns the greatest integer that is less than the provided `float` argument.

```
floor(1.5)      # 1
floor(3.0)      # 3
```

`ceil(float)`:

Returns the lowest integer that is greater than the provided `float` argument.

```
ceil(1.5)      # 2
ceil(3.0)      # 3
```

`random()`:

Returns a `float` that is anywhere between 0 (inclusive) and 1 (non-inclusive).

```
random()        # 0.9668186296877487
random()        # 0.2646426129169511
# so on
```
This can be combined with `ceil` or `floor` to generate random integers within a range.

```
floor(random() * 100)   # 43
floor(random() * 100)   # 32
# so on
```

### Other

`print(...args)`:

Takes a variadic number of arguments and will simply output each argument one by one to the standard output.

```
print(1)        # stdout prints 1
print('a', 'b') # stdout prints 'a' then 'b'
```

`now()`:

Returns the current time as a Unix timestamp as an `int`.

```
now()           # 1695120168581
# so on
```

Please take advantage of these global functions to aid in your programming whenever needed.

[Previous: Arrays & Objects](./arrays-and-objects.md)

[Next: Module Imports](./module-import.md)