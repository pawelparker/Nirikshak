# `@nirikshak/core`

This package with what makes Nirikshak tick. Below, we describe various function and internals that Nirikshak relies on to work its magic.

## Request graph

The table below describes edges of a request relationship graph for a resource.

| Source          | Target            |
| --------------- | ----------------- |
| Get Positive    | Get Positive      |
|                 | Delete Positive   |
|                 | Put Positive      |
|                 | Patch Positive    |
|                 | Post Negative     |
|                 | Put Destructive   |
|                 | Patch Positive    |
| Get Negative    | Get Negative      |
|                 | Delete Negative   |
|                 | Put Positive      |
|                 | Patch Negative    |
|                 | Post Positive     |
|                 | Put Destructive   |
|                 | Post Positive     |
| Delete Positive | Get Negative      |
|                 | Delete Negative   |
|                 | Put Positive      |
|                 | Patch Negative    |
|                 | Post Positive     |
|                 | Put Destructive   |
|                 | Post Positive     |
| Delete Negative | Get Negative      |
|                 | Delete Negative   |
|                 | Put Positive      |
|                 | Patch Negative    |
|                 | Post Positive     |
|                 | Put Destructive   |
|                 | Post Positive     |
| Put Positive    | Get Positive      |
|                 | Delete Positive   |
|                 | Put Positive      |
|                 | Patch Positive    |
|                 | Post Negative     |
|                 | Put Destructive   |
|                 | Patch Destructive |
| Post Positive   | Get Positive      |
|                 | Delete Positive   |
|                 | Put Positive      |
|                 | Patch Positive    |
|                 | Post Negative     |
|                 | Put Destructive   |
|                 | Patch Destructive |
| Post Negative   | Get Positive      |
|                 | Delete Positive   |
|                 | Put Positive      |
|                 | Patch Positive    |
|                 | Post Negative     |
|                 | Put Destructive   |
|                 | Patch Destructive |
| Patch Positive  | Get Positive      |
|                 | Delete Positive   |
|                 | Put Positive      |
|                 | Patch Positive    |
|                 | Post Negative     |
|                 | Put Destructive   |
|                 | Patch Destructive |
| Patch Negative  | Get Negative      |
|                 | Delete Negative   |
|                 | Put Positive      |
|                 | Patch Negative    |
|                 | Post Negative     |
|                 | Put Destructive   |
|                 | Post Destructive  |

No request can be made after a destructive request. If you don't have a particular node in your description, it is simply not added to the graph.
