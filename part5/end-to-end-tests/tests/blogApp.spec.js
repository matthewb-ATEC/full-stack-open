const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./hepler')

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
      await loginWith(page, 'username', 'password')
      await expect(page.getByText('Foo Bar logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'username', 'wrong')
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    const blog = {
      title: "a new blog",
      author: "Author",
      url: "www.url.com",
    }

    beforeEach(async ({ page }) => {
      await loginWith(page, 'username', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blog)
      await expect(page.getByText(blog.title).last()).toBeVisible()
    })
  
    describe('With an existing blog', async () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blog)
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByTestId('view-button').click()
        await page.getByTestId('like-button').click()
        await expect(page.getByText('1')).toBeVisible()
      })

      test('a blog can be delete by the user who created it', async ({ page }) => {
        await page.pause()
        await page.getByTestId('view-button').click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByTestId('delete-button').click()


        await expect(page.getByText(blog.title)).not.toBeVisible()
      })
    })
  })
})