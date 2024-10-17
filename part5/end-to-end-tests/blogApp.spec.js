const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
      const loginForm = page.getByTestId('LoginForm')
      await expect(loginForm).toBeVisible()
  })
})