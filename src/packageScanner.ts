export class PackageScanner {
  /**
   * A package.json object which was parsed from json text
   */
  private packageJson: any;

  /**
   *
   * @param packageJson a package.json object which was parsed from json text
   */
  constructor(packageJson: any) {
    this.packageJson = packageJson;
  }

  /**
   * Get a scripts of the package.json.
   *
   * @returns a PackageJsonScripts object instance contains package.json#scripts
   */
  public getScripts(): PackageJsonScripts {
    return new PackageJsonScripts(this.packageJson["scripts"]);
  }
}

/**
 * A utility class to handle package.json
 */
export class PackageJsonScripts {
  private readonly scripts: { [s: string]: unknown };
  constructor(scripts: { [s: string]: unknown }) {
    this.scripts = scripts;
  }

  public get(key: string): unknown {
    return this.scripts[key];
  }

  public keys(): string[] {
    return Object.keys(this.scripts);
  }
}
