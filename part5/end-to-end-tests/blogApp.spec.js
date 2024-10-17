const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Foo Bar',
        username: 'username',
        password: 'password'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
      const loginForm = page.getByTestId('LoginForm')
      await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('username')
        await page.getByTestId('password').fill('password')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Foo Bar logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('username')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })
})