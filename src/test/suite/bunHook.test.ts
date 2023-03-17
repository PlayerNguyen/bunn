import { testUtils } from "./../utils/TestUtils";
import * as mocha from "mocha";

import { expect } from "chai";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import {
  didBunInstalled,
  getBunVersion,
  installBunAsProcess,
} from "../../bunHook";

const downloadTimeout = process.env.DOWNLOAD_TEST_TIMEOUT || 20000;

suite("[unit] didBunInstalled - uninstalled bun", () => {
  mocha.before(async () => {
    // Forcibly remove bun directory
    await testUtils.bun.removeBun();
  });

  mocha.test("should return false", async () => {
    const _didBunInstalled: boolean = await didBunInstalled();
    expect(_didBunInstalled).to.be.false;
  });
});

suite("[unit] didBunInstalled - install bun", () => {
  mocha.before(async () => {
    // Forcibly remove bun directory
    await testUtils.bun.removeBun();
  });

  mocha.test("should return false", async () => {
    const _didBunInstalled: boolean = await didBunInstalled();
    expect(_didBunInstalled).to.be.false;
  });
});

suite("[unit] bunHook - bun is installed", () => {
  /**
   * Install the bun before the test
   * [!] Download require long timeout
   */
  mocha.before(async function () {
    this.timeout(downloadTimeout);
    await installBunAsProcess();
  });

  mocha.describe("getBunVersion", () => {
    test("should return exactly version if bun was installed", () => {
      expect(() => {
        getBunVersion();
      }).to.not.throws();

      let bunVersion = getBunVersion();
      // must be a string and semver (since bun using semver)
      expect(bunVersion).not.to.be.undefined;
      expect(bunVersion).to.be.a.string;
    });
  });

  mocha.describe("didBunInstall", () => {
    test("should return true when bun installed", async () => {
      expect(await didBunInstalled()).to.be.true;
    });
  });
});

// suite("[unit] bunHook - bun is uninstalled or not found", () => {
//   // Uninstall the bun before test
//   mocha.before(async (done) => {
//     if (await testUtils.bun.hasBunDirectory()) {
//       await testUtils.bun.removeBun();
//     }
//     done();
//   });

//   mocha.describe("getBunVersion", () => {
//     test("should throw error when bun have not been installed", () => {
//       expect(() => {
//         getBunVersion();
//       }).to.throws("Bun is not installed");
//     });
//   });

//   mocha.describe("installBunAsProcess", () => {
//     /**
//      * Remove the bun after run this test case
//      */
//     mocha.after(async () => {
//       if (await hasBun()) {
//         await uninstallBun();
//       }

//       expect(hasBun()).to.be.false;
//     });

//     /**
//      * Install the bun using process
//      */
//     test("should install bun as a process", function () {
//       // Download process depends on Internet connection
//       // Default: 20 seconds
//       this.timeout(downloadTimeout);

//       // Start installing the bun
//       return installBunAsProcess().then(async (installScriptUri) => {
//         expect(hasBun()).to.be.true;
//         expect(getBunDirectory()).to.not.be.undefined;

//         // Must clean up after install
//         expect(await exists(installScriptUri)).to.be.false;
//       });
//     });
//   });
// });
