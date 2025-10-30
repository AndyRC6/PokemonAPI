/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-extraneous-dependencies */

import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => children;

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });
const userEventRender = (jsx: any, options?: RenderOptions) => {
  const wrapper = customRender(jsx, options);
  return {
    user: userEvent.setup({ delay: null }),
    ...wrapper,
  };
};
export * from '@testing-library/react';
export { userEventRender as render };
