# Rest semantics

This section covers how we interpret and use REST semantics. Our understanding is based on [Roy Fielding's paper](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) as well as REST best practices in general. You should go through this section before you start writing your API descriptions.

<!-- TODO: add link to api description -->

## Uniform interface

All REST APIs expose a uniform interface. As per Roy Fielding's dissertation, REST is bound by 4 key constraints that allow it to provide a uniform interface. They are listed below:

1. Identification of resources
2. Manipulation of resources through representations
3. Self-descriptive messages
4. Hypermedia as the engine of application state.

We add two of our own constraints to the list. These constraints arise as a result of limited scope of the tool. We might overcome them in future.

1. We restrict ourselves to JSON as the engine of application state.
2. Resource are independent.

## Resource

Resources are the abstraction of information exposed by your application. They are essential for providing a uniform interface. Say that you have an API that provides access to student database of a college. You can then treat each student's entry as a resource. You can create, update, delete or retrieve a student.

While instructing the API to manipulate the student(s), all you need to do is tell the API how to identify the target student(s) and what manipulation to perform. With REST, you can specify this data via the semantics of your API request. So all you need to know is the resource you are dealing with and how to set the semantics for your request. You do not need intricate knowledge of the application internals.

## Resource representation

Resource representation is essentially how the resource is exposed via the API. We assume that your API works with JSON as the hypermedia format to provide resource representation. For example, imagine a student whose major is computer science and age is 22. This is our resource. You can expose this resource via following representation

```json
{
    "age": 22,
    "major": "Computer Science"
}
```

Resource representation is upto you. We only require the representation to be in JSON. **_In essence, we expect resource representation to be key-value pairs._**

## Resource identification

Each resource in your API must be identifiable. We have established that the resource is represented as key-value pairs. **_To identify a resource, we expect the resource representation to contain a top level "id" key_**. The id attribute must have a unique identifier as its value in the resource pool. So, resource of same type must have different keys. Resources of different types (For example, faculty and student) may have same ids. While this is not ideal, it is not forbidden.

## Resource manipulation

Each request has resource(s) that it aims to manipulate. The HTTP method associated with the request establishes semantics for what action is to be taken. We currently allow working with the following verbs:

1. GET: Retrieve resource
2. POST: Create resource
3. DELETE: Delete resource
4. PUT: Upsert resource
5. PATCH: Update resource

If your API uses other verbs not covered here, you can write your own tests to validate them.

## Resource independence

We assume each resource to be independent. That doesn't seem very practical. For example, a student is a resource and faculty is a resource. And a faculty can be related to a student. While this is true, we must remember that a resource is not a mapping to real world entities but instead information exposed by the application. A properly designed application should expose data of a faculty, student and their relationship separately. So we have three resources here: the student, the faculty and the relationship between them. They can be manipulated independently. In short, all your resources should be independent of each other when exposed via the API. They can be related behind the scenes. We test different resource independently.
