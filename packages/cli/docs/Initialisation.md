# Initialisation

Before starting with Nirikshak, you need a certain folder structure. `init` command helps you set up your project. We call that initialising the project. Now we cover all the steps that are taken during initialisation.

## Step 1: Making a basic directory structure

We create a few directories to set up your tests. Following steps are taken:

1. Create `.nirikshak` directory
2. Create the test folder
3. Create and populate folders for each resource. Process is same as during <a alt="adding a resource" href="Add.md#step-2-adding-the-resource-directory">adding a resource</a>.

**Note**: This step fails if `.nirikshak already exists`.

## Step 2: Placing the jest configuration

We add a jest configuration to your project. Following files are added to your project:

1. `jest.config.json` : We expect this file to be present before running tests. **You must not change the projects field manually**.

2. `jest.setup.js` : This is used to increase the jest timeout as a safe measure. We increase it from 5s to 30s. That is to make sure that the test does not timeout before your API can complete processing. You can change it to a value that suites you.
