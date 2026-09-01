import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from './ChatInterface';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ChatInterface Component Tests (FE-09)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial empty state with heading and input', () => {
    render(<ChatInterface />);
    
    expect(screen.getByRole('heading', { name: /start a conversation/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<ChatInterface />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('renders user message and shows loading state on form submit', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ text: 'Mocked AI streaming response' }),
      }), 100))
    );

    render(<ChatInterface />);
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Explain React state' } });
    expect(sendButton).not.toBeDisabled();
    fireEvent.click(sendButton);

    expect(screen.getByText('Explain React state')).toBeInTheDocument();
    expect(screen.getByText(/thinking and streaming tokens/i)).toBeInTheDocument();
  });

  it('handles successful API response correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Mocked AI response' }),
    });

    render(<ChatInterface />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'Test query' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });
  });

  it('renders designed error state and retry button on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network disconnect'));

    render(<ChatInterface />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Trigger Error' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/message delivery failed/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry message/i })).toBeInTheDocument();
    });
  });

  it('retries sending the failed message when retry button is clicked', async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ text: 'Responded after retry' }),
      });

    render(<ChatInterface />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Retry test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    const retryButton = await screen.findByRole('button', { name: /retry message/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Responded after retry')).toBeInTheDocument();
    });
  });
});