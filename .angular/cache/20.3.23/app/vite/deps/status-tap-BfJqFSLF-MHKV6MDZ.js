import {
  findClosestIonContent,
  scrollToTop
} from "./chunk-FWZ2F4JA.js";
import {
  componentOnReady
} from "./chunk-RNVWAKZ3.js";
import {
  readTask,
  writeTask
} from "./chunk-I4EHL4NE.js";
import {
  __async
} from "./chunk-EGSMBJJY.js";

// node_modules/@ionic/core/dist/esm/status-tap-BfJqFSLF.js
var startStatusTap = () => {
  const win = window;
  win.addEventListener("statusTap", () => {
    readTask(() => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const el = document.elementFromPoint(width / 2, height / 2);
      if (!el) {
        return;
      }
      const contentEl = findClosestIonContent(el);
      if (contentEl) {
        new Promise((resolve) => componentOnReady(contentEl, resolve)).then(() => {
          writeTask(() => __async(null, null, function* () {
            contentEl.style.setProperty("--overflow", "hidden");
            yield scrollToTop(contentEl, 300);
            contentEl.style.removeProperty("--overflow");
          }));
        });
      }
    });
  });
};
export {
  startStatusTap
};
//# sourceMappingURL=status-tap-BfJqFSLF-MHKV6MDZ.js.map
