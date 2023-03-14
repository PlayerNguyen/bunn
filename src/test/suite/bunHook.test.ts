import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { hasBun, installBun, installBunAsProcess } from "../../bunHook";

suite("Bun Hook Unit test", () => {
  test("Should install bun completely", () => {
    assert.doesNotThrow(() => {
      installBun();
    });

    assert.strictEqual(hasBun(), true);
  });

  test("Should install bun as a process", () => {
    installBunAsProcess();
  });
});
