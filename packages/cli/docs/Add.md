# Adding a resource

To add a resource to your project, `add` command comes handy. It performs a few checks and then adds the resource. Add command takes the following arguments:

1. `[name]`: Name of the resource to be added. **Must be provided.**
1. `[dir]`: Directory of the resource to be added. It is an optional argument which defaults to the resource name. This is the path to be used to store tests for the resource relative to the test directory.

Following steps are taken during addition of a resource:

## Step 1: Checking for conflict

Resource names and directories are unique. Addition of a new resource must respect these constraints. Therefore, we perform two checks:

1. Resulting resource directory must not exist.
2. The resouce name should not match any existing resource in the configuration.

## Step 2: Adding the resource directory

Now we populate the resource directory. The process is same as the initialisation phase. Following steps are taken:

 <!-- TODO : Add a reference to run command -->
 <!-- TODO: Add a link to desc writing -->

1. Create `{test directory}/{resource directory}` folder.
2. Add `config.json` - the default resource test configuration. You can read more about it in running the tests.
3. Add `resource.json` - the resource description template.
4. Add `endpoints.json` - the server implementation description template.
5. Add `helpers.ts` - the test helpers: file to manage test setup, teardown and your custom functions. You can read about it in writing API description.
6. Add `[resourcename].test.ts` - the test file to be used by jest. It is created by using a template. The template is populated by path to your app and the name of your resource.

## Step 3: Updating configuration files

After resource files have been placed, we update the Nirikshak configuration file by adding an entry for the resource. We also update the jest configuration by adding a new project corresponding to the resource.
