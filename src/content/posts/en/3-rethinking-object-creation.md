---
author: Epilef Rodriguez
categories: ["javascipt class oop function patterns"]
date: 05/03/2024
featured: false
image: ../images/rethinking-object-creation.jpg
title: Rethinking Object Creation - Why Functions Might Be Your New Favorite Class in JavaScript
---

## Introduction

JavaScript's introduction of classes in ES6 felt like a warm hug for developers coming from object-oriented languages. But as we delve deeper, some interesting quirks and limitations of JavaScript's class syntax emerge. Today, we'll explore why functions, through the lens of the Factory Pattern, can offer a powerful and potentially more flexible alternative for object creation.

## Caveats of the Class Syntax

Hidden Prototype Chain: Classes introduce a hidden prototype chain, which can be confusing for beginners and lead to unexpected behavior. Understanding and managing this chain becomes crucial for complex scenarios.

Limited Control Over Object Creation: The new keyword is tightly coupled with classes, limiting flexibility in object creation logic. This can hinder advanced use cases like dynamic object creation based on runtime conditions.

Boilerplate and Verbosity: While classes provide structure, they can also lead to boilerplate code, especially for simple objects. This can impact code readability and maintainability.

## The Power of the Factory Pattern

The Factory Pattern, implemented using functions, offers several advantages:

Explicit Object Creation Logic: Functions allow you to encapsulate object creation logic explicitly, making it clear and easy to understand. This is particularly beneficial for complex object initialization or conditional object creation.

Flexibility and Reusability: Factory functions can create different object types based on input parameters, promoting code reuse and adaptability. This is especially useful when dealing with object variations or dynamic configurations.

Improved Testability: Functions are generally easier to test in isolation compared to classes. This can lead to more robust and maintainable codebases.

## Example: User Object Creation

Here's an example comparing class and factory function approaches for creating user objects:

## Using Class:

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const user1 = new User("Alice", "alice@example.com");

```

Now, let's address the scenario where you want to call the greet() method of a User when a button is clicked. However, directly assigning the method to the button's click property might lead to unexpected behavior:

```javascript
const button = {
  click: user1.greet
}

console.log(button.click()); // This will now print "Hello, my name is undefined"
```

The reason for this is because the `greet` method is a function defined within the context of the `User` object. When you assign it to the `click` property, you're essentially taking the function out of its original `context`. When the button is clicked, the `greet` method is called without the this keyword referencing the `User` object. Inside the `greet` method, `this.name` would then refer to the `global scope`, which doesn't have a `name` property, resulting in `undefined`. To fix this you have to `bind`:

```javascript
const button = {
  click: user1.greet.bind(user1) // Bind 'greet' to 'user1' context
}

console.log(button.click()); // This will now print "Hello, my name is Alice"

```


## Using Factory Function:

```javascript
function createUser(name, email) {
  return {
    name,
    email,
    greet() {
      console.log(`Hello, my name is ${this.name}`);
    },
  };
}

const user1 = createUser("Alice", "alice@example.com");

```

In this example, the factory function offers clearer object initialization logic and allows for potential variations in user object creation (e.g., adding admin privileges based on a flag).

No need to bind.

## Choosing the Right Tool:

While both classes and factory functions have their merits, understanding their nuances is crucial for making informed decisions. Classes are still valuable for complex object hierarchies and inheritance scenarios. However, for simpler object creation, especially when flexibility and control are paramount, factory functions using the Factory Pattern can be a powerful and elegant alternative.

## Conclusion

Remember, the best approach often lies in understanding the trade-offs and choosing the tool that best aligns with your specific needs and project requirements.