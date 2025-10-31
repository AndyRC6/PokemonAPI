import React from 'react';
import { render } from './test-utils';
import { screen } from '@testing-library/react';
import App from './App';

jest.mock('../README.md', () => ({
  text: jest.fn().mockResolvedValue('hello world'),
}));

test('renders home page markdown', async () => {
  render(<App />);
  const el = await screen.findByTestId('MockReactMarkdown');
  expect(el).toBeInTheDocument();
  expect(el).toHaveTextContent('hello world');
});
