import { Access } from "./access";

export interface FilterInput {
    access: {
        includes: Access;
        excludes: Access;
    }
  }
  