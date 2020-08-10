export interface Configuration {
    dir: string;
    resources: Array<string | { name: string; dir: string }>;
    app: string;
    jestArgs?: string[];
}

export interface CliArgs {
    configuration: Configuration;
    config: string;
}

type ProjectConfig = { displayName: string; testMatch: string[] };
export interface JestConfig {
    projects: ProjectConfig[];
    setupFilesAfterEnv: string[];
    reporters: string[];
}
