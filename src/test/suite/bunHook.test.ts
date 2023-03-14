import * as mocha from "mocha";

import { expect } from "chai";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import {
  getBunDirectory,
  hasBun,
  installBunAsProcess,
  uninstallBun,
} from "../../bunHook";
import { exists } from "../../fileExists";

suite("[Unit] bunHook", () => {
  /**
   * Uninstall the bun before test
   */
  mocha.before(async () => {
    if (hasBun()) {
      await uninstallBun();
    }

    expect(hasBun()).to.be.false;
  });

  test("Should install bun as a process", function () {
    // Download process depends on Internet connection
    // Default: 20 seconds
    this.timeout(20000);

    // Start installing the bun
    return installBunAsProcess().then(async (installScriptUri) => {
      expect(hasBun()).to.be.true;
      expect(getBunDirectory()).to.not.be.undefined;

      // Must clean up after install
      expect(await exists(installScriptUri)).to.be.false;
    });
  });
});
