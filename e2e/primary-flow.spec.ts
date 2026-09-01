import { test, expect } from '@playwright/test';

test.describe('Primary Chat Flow E2E', () => {
  test('completes full chat interaction end-to-end', async ({ page }) => {
    await page.goto('/');

    // Verify empty state onboarding elements
    await expect(page.getByRole('heading', { name: /start a conversation/i })).toBeVisible();

    // Fill message input and send
    const input = page.getByRole('textbox');
    await input.fill('Hello AI Assistant');
    await page.getByRole('button', { name: /send/i }).click();

    // Assert user message appears
    await expect(page.getByText('Hello AI Assistant')).toBeVisible();
  });
});