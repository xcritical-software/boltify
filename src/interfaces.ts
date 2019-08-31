interface IJSONValue {
  [key: string]: IJSONValue;
}

interface IWorkspace {
  dir: string;
  name: string;
  config: IJSONValue;
  relativeDir: string;
}
