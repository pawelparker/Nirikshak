# Configuration file

Nirikshak needs a configuration file to run. It keeps track of your directory structure using that file. Nirikshak searches for `nirikshak.json` in the working directory by default. You can change the path to configuration file using `--config` option. **All paths must be relative to the working directory.**

# Fields

Now we cover all the fields of that can be in the configuration. We discuss purpose of the field, validations and assumptions we make about it.

## 1. `dir`

This is a required non empty string. The directory to use for testing. Nirikshak creates this directory during initialisation. This argument is a path **relative to the working directory**. Nirikshak configures jest to work with this directory. **Once written, you must not change this field directly.**

## 2. `app`

This is a required non empty string. The server implementation to use for testing. In case you provide type definitions for your application, enter the path to the js file. The path must point to an existent file. **Once written, you must not change this field directly.**

## 3. `resources`

This is a required field. It is basically a list of resources in your application. Each resource should be given an name should that we can identify it internally. The field is of array type. Each entry is of one of either:

-   A string depicting resource name. By default, we will store all the tests for the resource in `{dir}/{resource name}` directory. Name must be non empty
-   An object of shape `{name: string, dir: string}` where `name` and `dir` are non empty. We will use `name` to identify the resource. We store all the tests for it in `{dir}/{resource dir}`. So `dir` argument must be relative to the test directory.

The array must be non empty. No two resources should have the same name or directory. **Once written, you must not change this field directly.**

## 4. `jestArgs`

This is an optional field. It is an array of strings which consists of cli args that you want to pass to jest while invoking it for testing. Note that we always pass `--color=false` and `--noStackTrace` to format jest logs in a desirable way. These options cannot be overriden.

# Editing configuration

1. **_dir_** : Rename the test directory to new name. Then change the key in configuration.
2. **_app_** : Change the import path for all tests. Then change the key in configuration.
3. **_resources_** : Entry can be added with `add` command and removed with `remove` command
4. **_jestArgs_** : Can be changed anytime. Value is read on runtime.

# Example configuration files

Below are some examples of valid configurations:

```json
{
    "dir": "tests",
    "resources": [{ "name": "student", "dir": "st" }, "faculty"],
    "app": "app.ts"
}
```

```json
{
    "dir": "tests",
    "resources": ["student", "faculty"],
    "app": "src/index.ts",
    "jestArgs": ["str", "str2"]
}
```

```json
{
    "dir": "tests",
    "resources": [
        "student",
        {
            "name": "faculty",
            "dir": "fc"
        }
    ],
    "app": "app.ts",
    "jestArgs": []
}
```
