# Removing a resource

When you want to remove a resource from your project, you must use the `remove` command. It performs a few validations and then removes the resource from your project. It takes name of the resource as an argument.

## Step 1: Checking for conflict

Provided resource name is checked against project configuration. If no resource with given name is found, an error is reported. Only existing resources can be removed.

## Step 2: Removing the resource directory

Directory structure for the selected resource is deleted. The resource directory is given by `{test directory}/{resource directory}`.

## Step 3: Updating configuration files

After resource files have been deleted, we update the Nirikshak configuration file by removing the entry for the resource. We also update the jest configuration by removing the project corresponding to the resource.
