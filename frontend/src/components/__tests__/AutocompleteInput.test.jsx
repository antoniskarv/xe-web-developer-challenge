import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import AutocompleteInput from '../AutocompleteInput';
import userEvent from '@testing-library/user-event';

const API_BASE_URL = 'http://localhost:8080';
vi.stubGlobal('import.meta', { env: { VITE_API_BASE_URL: API_BASE_URL } });

describe('AutocompleteInput', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('is not fetching data when the user input is LESS than 3 characters', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    render(<AutocompleteInput onSelect={() => {}} />);

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Πληκτρολόγησε περιοχή/i);

    await user.type(input, 'na');
    await waitFor(() => expect(fetchSpy).not.toHaveBeenCalled());
  });

  it('fetches data when the user input is MORE than 3 characters', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [
        { placeId: 'p1', mainText: 'Nafplio', secondaryText: 'Ελλάδα' },
      ],
    });

    render(<AutocompleteInput onSelect={() => {}} />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Πληκτρολόγησε περιοχή/i);

    await user.type(input, 'naf');

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/autocomplete?input=naf`
      );
    });

    expect(await screen.findByText('Nafplio')).toBeInTheDocument();
  });
});
