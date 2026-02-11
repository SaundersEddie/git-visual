export type Commit = {
  sha: string;
  parents: string[];
  author: string;
  date: string;
  message: string;
  refs: string[];
};
