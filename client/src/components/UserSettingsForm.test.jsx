import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserSettingsForm from './UserSettingsForm';

describe('UserSettingsForm', () => {
  test('shows error message for invalid email', async () => {
    render(<UserSettingsForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'bad-email');
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test('shows error message for too short username', async () => {
    render(<UserSettingsForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    await userEvent.type(usernameInput, 'ab');
    fireEvent.blur(usernameInput);

    expect(await screen.findByText(/username must be at least 3 characters/i)).toBeInTheDocument();
  });

  test('submits successfully with valid values', async () => {
    render(<UserSettingsForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const themeSelect = screen.getByLabelText(/theme preference/i);
    const newsletterCheckbox = screen.getByLabelText(/newsletter subscription/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    await userEvent.type(usernameInput, 'user123');
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.selectOptions(themeSelect, 'Dark');
    await userEvent.click(newsletterCheckbox);

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/"username": "user123"/i)).toBeInTheDocument();
    expect(screen.getByText(/"email": "user@example.com"/i)).toBeInTheDocument();
  });
});
