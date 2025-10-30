import '@testing-library/jest-dom';

global.fetch = (args: any) =>
  Promise.resolve({
    ok: true,
    json: () => {},
    text: () => {},
    ...args,
  }) as Promise<Response>;
