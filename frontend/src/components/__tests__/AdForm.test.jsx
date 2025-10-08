import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../test/utils';
import AdForm from '../AdForm';

const API_BASE_URL = 'http://localhost:8080';
vi.stubGlobal('import.meta', { env: { VITE_API_BASE_URL: API_BASE_URL } });

describe('AdForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows error message when the user leaves the title field empty', async () => {
    render(<AdForm />);
    const title = screen.getByLabelText(/Τίτλος/i);
    await userEvent.click(title);
    await userEvent.tab();
    expect(await screen.findByText(/Τίτλος.*υποχρεωτικός/i)).toBeInTheDocument();
  });

  it('disables submit button when the form is not valid', async () => {
    render(<AdForm />);
    const btn = screen.getByRole('button', { name: /Υποβολή Αγγελίας/i });
    expect(btn).toBeDisabled();
  });

  it('shows error message for price field if value is not positive number', async () => {
    render(<AdForm />);
    const price = screen.getByLabelText(/Τιμή/i);

    await userEvent.click(price);
    await userEvent.type(price, '0');
    await userEvent.tab();

    expect(
      await screen.findByText(/Τιμή.*θετικός αριθμός/i)
    ).toBeInTheDocument();
  });

  it('cleans the price error once a correct value is given', async () => {
    render(<AdForm />);
    const price = screen.getByLabelText(/Τιμή/i);

    await userEvent.type(price, '0');
    await userEvent.tab();
    expect(
      await screen.findByText(/Τιμή.*θετικός αριθμός/i)
    ).toBeInTheDocument();

    await userEvent.clear(price);
    await userEvent.type(price, '750');
    await userEvent.tab();

    await waitFor(() => {
      expect(
        screen.queryByText(/Τιμή.*θετικός αριθμός/i)
      ).not.toBeInTheDocument();
    });

    const btn = screen.getByRole('button', { name: /Υποβολή Αγγελίας/i });
    expect(btn).toBeDisabled();
  });
});
