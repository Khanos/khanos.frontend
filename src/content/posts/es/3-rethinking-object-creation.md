---
author: Epilef Rodriguez
categories: ["javascipt class oop function patterns"]
date: 05/03/2024
featured: false
image: ../images/rethinking-object-creation.jpg
title: Redefiniendo la Creación de Objetos - ¿Por Qué las Funciones Podrían Ser Tu Nueva Clase Favorita en JavaScript?
---

## Introducción

La introducción de clases en JavaScript en ES6 se sintió como un cálido abrazo para los desarrolladores que vienen de lenguajes orientados a objetos. Pero a medida que profundizamos, surgen algunas peculiaridades y limitaciones interesantes de la sintaxis de clases de JavaScript. Hoy, exploraremos por qué las funciones, a través del lente del Patrón Fábrica, pueden ofrecer una alternativa poderosa y potencialmente más flexible para la creación de objetos.

## Sintaxis de Clases

Cadena de Prototipos Oculta: Las clases introducen una cadena de prototipos oculta, que puede ser confusa para principiantes y conducir a un comportamiento inesperado. Comprender y administrar esta cadena se vuelve crucial para escenarios complejos.

Control Limitado Sobre la Creación de Objetos: La palabra clave new está estrechamente vinculada a las clases, lo que limita la flexibilidad en la lógica de creación de objetos. Esto puede dificultar los casos de uso avanzados como la creación dinámica de objetos basada en condiciones de tiempo de ejecución.

Código Redundante y Verbosidad: Si bien las clases brindan estructura, también pueden generar código repetitivo, especialmente para objetos simples. Esto puede afectar la legibilidad y el mantenimiento del código.

## El Poder del Patrón Fábrica

El Patrón Fábrica, implementado usando funciones, ofrece varias ventajas:

Lógica de Creación de Objetos Explícita: Las funciones te permiten encapsular la lógica de creación de objetos de manera explícita, haciéndola clara y fácil de entender. Esto es particularmente beneficioso para la inicialización de objetos complejos o la creación de objetos condicionales.

Flexibilidad y Reutilización: Las funciones de fábrica pueden crear diferentes tipos de objetos según los parámetros de entrada, lo que fomenta la reutilización del código y la adaptabilidad. Esto es especialmente útil cuando se trata de variaciones de objetos o configuraciones dinámicas.

Mejora de la Capacidad de Prueba: Las funciones generalmente son más fáciles de probar de forma aislada en comparación con las clases. Esto puede conducir a bases de código más robustas y mantenibles.

## Ejemplo: Creación de Objetos de Usuario

Aquí hay un ejemplo que compara los enfoques de clase y función de fábrica para crear objetos de usuario:

## Usando Clase:

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

Ahora, abordemos el escenario en el que deseas llamar al método greet() de un Usuario cuando se hace clic en un botón. Sin embargo, asignar directamente el método a la propiedad click del botón podría conducir a un comportamiento inesperado:

```javascript
const button = {
  click: user1.greet
}

console.log(button.click()); // Esto ahora imprimirá "Hello, my name is undefined"
```

La razón de esto es porque el método `greet` es una función definida dentro del contexto del objeto `User`. Cuando lo asignas a la propiedad `click`, esencialmente estás sacando la función de su `contexto` original. Cuando se hace clic en el botón, se llama al método `greet` sin que la palabra clave `this` haga referencia al objeto `User`. Dentro del método `greet`, `this.name` se referiría entonces al `ámbito global`, que no tiene una propiedad `name`, lo que resulta en `undefined`. Para solucionar esto, tienes que `bind`:

```javascript
const button = {
  click: user1.greet.bind(user1) // Bind 'greet' al contexto de 'user1'
}

console.log(button.click()); // Esto ahora imprimirá  "Hello, my name is Alice"

```


## Usando Función de Fábrica:

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

En este ejemplo, la función de fábrica ofrece una lógica de inicialización de objetos más clara y permite posibles variaciones en la creación de objetos de usuario (por ejemplo, agregar privilegios de administrador basados en un indicador).

No es necesario vincular.

## Elección de la Herramienta Adecuada:

Si bien tanto las clases como las funciones de fábrica tienen sus méritos, comprender sus matices es crucial para tomar decisiones informadas. Las clases siguen siendo valiosas para jerarquías de objetos complejas y escenarios de herencia. Sin embargo, para la creación de objetos más simples, especialmente cuando la flexibilidad y el control son fundamentales, las funciones de fábrica utilizando el Patrón Fábrica pueden ser una alternativa poderosa y elegante.

## Conclusión

Recuerda, el mejor enfoque a menudo radica en comprender los compromisos y elegir la herramienta que mejor se alinee con tus necesidades específicas y los requisitos del proyecto.