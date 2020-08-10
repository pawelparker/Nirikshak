# Requests and relationship between them

We discussed our interpretation of REST semantics. We also discussed different types of requests on the basis of their outcome and what they meant in context of REST semantics. Now we move on to the next step - Relationship between different requests.

Every request has a target resource(s). We discussed that we consider resources to be independent. So while talking of a resource, we only talk about requests that affect it. The idea is to find out the relationship between requests that target the same resource and harness that to make test case flows. Then we can test for any resource as and when needed. From this point on, we consider resource to be same (or constant) for the scope of our discussion. That means we are discussing requests that affect the same resource.

## Semantics of a request

A request is a combination of method, url, body (if any) and headers. Currently, we support generating requests on the basis of these attributes. Future versions of the tool may have more advanced features such as supporting cookies. You describe these attributes to us and we populate your description format using REST semantics and an appropriate resource instance.

The key attributes of a request are its method and the outcome it is supposed to bring. Knowing these helps us know what the request intended to do. We make assertions about the application and use requests to validate them. If the response from the API was as expected, our assertions are successful. Else they fail and so does the test. Consider an example:

You have an API that manages the student database of a college. You make a `Get Negative` request to the API. That means you try to fetch a non existent student. You expect the API to send an error saying that the resource does not exist. If that happens then your assertion succeeds. You took a student that was not supposed to exist and it did not. But if the API does not throw any error, that means it did not behave as expected. Your assertion fails and you discover a bug.

## Assertion result and API state

Assertions based on requests provide you with information about the application state. In our example above, say that the assertion succeeded. Fetching a student that was not supposed to exist caused API to send an error. You now know that the student you tried to fetch doesn't exist. So you know what to expect from any request made using that student at this point. For example:

1. A `Get Positive` request should fail as it asserts that the student exists but it does not. And the API should send an error confirming the same.
2. A `Delete Negative` request should succeed as it asserts that the student cannot be deleted because it doesn't exist. And the API should send an error conforming the same.
3. A `Post Positive` request should succeed as it asserts that if you can create this non existent student. And the API should send the affirmation for the same.

If we know that a given request succeeded (i.e., the corresponding assertion was validated), we can decide which requests should succeed from this point onwards. For every resource, we essentially maintain a graph of all the possible request sequences. Nodes of that graph are the requests that can be made (which are deduced from your API description). Edge from one node to another means that if source node's assertion succeeds, you shoud expect the target node's assertion to succeed too.

## Nodes

Based on your description, we collect each possible request scenario. This is simply a combination of request attributes discussed before. Each request is treated as a node of our Graph. So a node is nothing but a combination of:

1. URL
2. Input data - Status, query parameters and body if present.
3. Expected output data - Status, headers and body if present.

Two nodes are considered equivalent if they make the same assertion. That means requests with same method and outcome case are equivalent. Say that you have two ways to `Get` a student from the API. In that case, both `Get Positives` will assert that the given student exists. Similarly, both `Get Negatives` will assert that the given student does not exist.

An example of a node is:

```yaml
URL: /Student/{resource:id}
METHOD: GET
TYPE: POSITIVE
INDEX: 0 # Used to identify a node amongst equivalent nodes
```

This refers to a `Get` request made at the url `/Student/<student-id>` expecting a `Positive` outcome. This request is of `0` index which means that it is the first one of all equivalent `Get Positive` requests. If there is only one way to make `Get Positive` request for the resource, only `0th` index node exists. The data for this request is supposed to be populated using an existing student and the request expects the API to respond by indicating that the student exists. 

## Edges

Now we discuss the edges that can be in the graph. First off, we generalize equivalent nodes. This means that all equivalent nodes have same the targets for outgoing edges and same sources for the incoming edges.

For example, consider `Get Positive: 0` and `Get Positive: 1` from our discussion above. Any request that can be made after `Get Positive: 0` can be made after `Get Positive: 1`. Similarly, any request that can be made before `Get Positive: 0` can be made before `Get Positive: 1`.

An edge between two nodes boils down to the **method** and the **outcome case** of the source and target nodes. We maintain a hardcoded algorithm that takes in two nodes and tells you if an edge is possible between them.

## Graph

The complete graph is described [here](../packages/core/README.md#request-graph).
