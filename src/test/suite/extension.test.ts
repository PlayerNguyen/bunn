import { testUtils } from "./../utils/TestUtils";
import { expect } from "chai";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as mocha from "mocha";
import { installBunAsProcess } from "../../bunHook";

const downloadTimeout = process.env.DOWNLOAD_TEST_TIMEOUT || 20000;

suite("[e2e] with bun installed", () => {
  mocha.before(async () => {
    if (!(await testUtils.bun.hasBunDirectory())) {
      await installBunAsProcess();
    }
  });

  test("[command] bunn.upgrade - should not throw any error", () => {
    expect(async () => {
      await vscode.commands.executeCommand("bunn.upgrade");
    }).to.not.throws();
  });

  test("[command] bunn.installBun - should not install bun (exceed timeout)", async function () {
    vscode.commands.executeCommand("bunn.installBun");
    expect(await testUtils.bun.hasBunDirectory()).to.be.true;

    return;
  });
});

suite("[e2e] with bun not installed", () => {
  mocha.before(async () => {
    if (await testUtils.bun.hasBunDirectory()) {
      await testUtils.bun.removeBun();
    }

    expect(await testUtils.bun.hasBunDirectory()).to.be.false;
  });

  test("[command] bunn.installBun - should install bun", async function () {
    this.timeout(downloadTimeout);

    await vscode.commands.executeCommand("bunn.installBun");
    expect(await testUtils.bun.hasBunDirectory()).to.be.true;
  });
});
