import { atom } from "recoil";

const instrumentState = atom({
  key: "instrument",
  default: "---",
});

const instrumentListState = atom({
  key: "instrumentList",
  default: [],
});

export { instrumentState, instrumentListState };
