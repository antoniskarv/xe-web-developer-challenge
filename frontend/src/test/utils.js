import { render } from '@testing-library/react';

export function customRender(ui, options = {}) {
  return render(ui, options);
}

export * from '@testing-library/react';
