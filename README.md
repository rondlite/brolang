# BroLang Complete Ruleset

BroLang is a high-level programming language that infuses bro slang and street language into coding, making it both fun and relatable. Below is the complete ruleset for BroLang.

---

## 1. Basic Syntax

- **Case Sensitivity**: BroLang is case-insensitive, but it's stylish to write keywords in lowercase.
- **Statements**: Each statement ends with a semicolon `;`.
- **Comments**:
  - **Single-line comments** start with `//`.
    ```brolang
    // This is a single-line comment
    ```
  - **Multi-line comments** are enclosed within `/*` and `*/`.
    ```brolang
    /*
    This is a
    multi-line comment
    */
    ```

---

## 2. Data Types

- **Chill**: Represents integer numbers.
  ```brolang
  yo age = 25;            // Chill
  ```
- **Dope**: Represents floating-point numbers.
  ```brolang
  yo piApprox = 3.14;     // Dope
  ```
- **Vibes**: Represents strings of text.
  ```brolang
  yo greeting = "What's up, bro?";   // Vibes
  ```
- **Flex**: Represents boolean values.
  - `straightUp` for `true`.
  - `nah` for `false`.
  ```brolang
  yo isChill = straightUp;   // Flex
  ```
- **Squad**: Represents arrays or lists.
  ```brolang
  yo squad numbers = [1, 2, 3, 4, 5];
  ```

---

## 3. Variables and Constants

- **Variable Declaration**: Use the keyword `yo` to declare a variable.
  ```brolang
  yo gains = 100;            // Chill
  yo mood = "lit";           // Vibes
  yo isSwole = straightUp;   // Flex
  yo score = 99.5;           // Dope
  ```
- **Constant Declaration**: Use `nocap` before `yo` to declare a constant that cannot be changed.
  ```brolang
  nocap yo pi = 3.14159;     // Dope constant
  nocap yo maxLevel = 99;    // Chill constant
  ```
  *Attempting to modify a constant will result in an error.*

---

## 4. Operators

### Arithmetic Operators

- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Modulo: `%`

```brolang
yo total = gains + 50;
```

### Comparison Operators

- Equal to: `==`
- Not equal to: `!=`
- Greater than: `>`
- Less than: `<`
- Greater than or equal to: `>=`
- Less than or equal to: `<=`

```brolang
if (score >= 90) {
  // code block
}
```

### Logical Operators

- And: `&&` or `and`
- Or: `||` or `or`
- Not: `!` or `not`

```brolang
if (isSwole and hasGains) {
  // code block
}
```

---

## 5. Control Structures

### If Statement

```brolang
if (condition) {
  // code block
}
```

### Else If Statement

```brolang
else if (anotherCondition) {
  // code block
}
```

### Else Statement

```brolang
else {
  // code block
}
```

### Switch Statement

Use `swag` and `vibeCheck` for switch-case structures.

```brolang
swag (variable) {
  vibeCheck value1:
    // code block
    break;
  vibeCheck value2:
    // code block
    break;
  default:
    // code block
}
```

### While Loop

```brolang
while (condition) {
  // code block
}
```

### For Loop

```brolang
for (yo i = 0; i < limit; i++) {
  // code block
}
```

### Foreach Loop

Use `forEvery` keyword.

```brolang
forEvery (item in squad) {
  // code block
}
```

### Break and Continue

- **Break**: Use `break;` to exit a loop early.
- **Continue**: Use `continue;` to skip to the next iteration.

---

## 6. Functions

### Function Declaration

Use the keyword `brofunc` to declare a function.

```brolang
brofunc functionName(parameters) {
  // code block
}
```

**Example:**

```brolang
brofunc addGains(yo a, yo b) {
  bounce a + b;
}
```

### Function Call

```brolang
yo result = addGains(10, 20);
```

### Return Statement

Use `bounce` to return a value from a function.

---

## 7. Input and Output

### Print to Console

Use `spill` to print output.

```brolang
spill "Yo, what's up?";
spill "Total gains: " + total;
```

### User Input

Use `holla` to get input from the user.

```brolang
yo name = holla "What's your name?";
```

---

## 8. Arrays and Collections

### Array Declaration

Use the data type `squad`.

```brolang
yo squad gains = [10, 20, 30];
yo squad names = ["Bro", "Dude", "Mate"];
```

### Accessing Elements

```brolang
yo firstGain = gains[0];
gains[2] = 35;
```

### Array Methods

- **Add Element**: `squad.push(value);`
- **Remove Last Element**: `squad.pop();`
- **Length of Array**: `squad.length;`

```brolang
gains.push(40);
yo totalGains = gains.length;
```

---

## 9. Objects and Classes

### Class Declaration

Use `bigBro` to declare a class.

```brolang
bigBro ClassName {
  // properties and methods
}
```

**Example:**

```brolang
bigBro GymBro {
  yo gains;
  
  brofunc init(yo initialGains) {
    me.gains = initialGains;
  }
  
  brofunc flex() {
    spill "Flexing with " + me.gains + " gains!";
  }
}
```

### Creating Objects

```brolang
yo bro1 = new GymBro(100);
bro1.flex();
```

### This Keyword

Use `me` to refer to the current object.

---

## 10. Error Handling

### Try-Catch Blocks

Use `noWorries` and `allGood` for try-catch structures.

```brolang
noWorries {
  // code that might throw an error
} allGood (yo error) {
  spill "Chill, an error occurred: " + error;
}
```

---

## 11. Modules and Importing

### Import Modules

Use `bringIn` to import external modules.

```brolang
bringIn "mathBro";
```

---

## 12. Special Keywords

- **Return Statement**: `bounce`
- **Null Value**: `ghost`
  ```brolang
  yo nothingHere = ghost;
  ```
- **New Keyword**: `new` to create a new object instance.
- **This Keyword**: `me` to refer to the current object.

---

## 13. Casting and Type Conversion

### Casting Values

```brolang
yo numberAsString = (vibes) 123;     // Cast integer to string
yo stringAsNumber = (chill) "456";   // Cast string to integer
```

---

## 14. Inheritance

### Extending Classes

Use `inherits` to extend a class.

```brolang
bigBro SuperGymBro inherits GymBro {
  brofunc superFlex() {
    spill "Super flex with " + me.gains * 2 + " gains!";
  }
}
```

---

## 15. Lambda Expressions

### Anonymous Functions

Use `brofunc` without a name.

```brolang
yo add = brofunc (yo x, yo y) {
  bounce x + y;
};
yo result = add(5, 10);
```

---

## 16. Enumerations

Use `options` to declare an enumeration.

```brolang
options GymStatus {
  newbie,
  intermediate,
  pro
}

yo status = GymStatus.pro;
```

---

## 17. File I/O

### Reading and Writing Files

Use `readBro` and `writeBro`.

```brolang
yo data = readBro "data.txt";
writeBro "output.txt", data;
```

---

## 18. Concurrency

### Threads

Use `squadGoals` to create concurrent threads.

```brolang
squadGoals {
  // code to run concurrently
}
```

---

## 19. Comments and Documentation

### Documentation Comments

Use `///` for documentation comments that can be used by a documentation generator.

```brolang
///
/// This function adds two numbers.
///
brofunc add(yo a, yo b) {
  bounce a + b;
}
```

---

## 20. Entry Point

### Main Function

The entry point of a BroLang program is the `main` function.

```brolang
brofunc main() {
  // code to execute
}
```

---

# Example Program

```brolang
brofunc main() {
  spill "Welcome to BroLang!";
  
  yo squad gainsList = [10, 20, 30];
  
  forEvery (gain in gainsList) {
    spill "Gain: " + gain;
  }
  
  yo totalGains = 0;
  for (yo i = 0; i < gainsList.length; i++) {
    totalGains = totalGains + gainsList[i];
  }
  
  spill "Total Gains: " + totalGains;
  
  brofunc getMotivation(yo level) {
    if (level > 50) {
      bounce "You're on fire, bro!";
    } else {
      bounce "Keep pushing, bro!";
    }
  }
  
  yo message = getMotivation(totalGains);
  spill message;
}
```

---

**Note**: This ruleset is designed to make coding in BroLang a fun and engaging experience, blending programming concepts with bro slang. Feel free to expand and customize it to fit your specific needs.
