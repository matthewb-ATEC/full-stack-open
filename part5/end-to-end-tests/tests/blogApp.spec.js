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
      likes: 0,
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

      test('a blog can be deleted by the user who created it', async ({ page }) => {
        await page.getByTestId('view-button').click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByTestId('delete-button').click()

        await expect(page.getByTestId('blog-element').filter({ hasText: blog.title })).not.toBeVisible()
      })
    })

    describe('With many blogs', async () => {
      test('blogs are sorted by likes', async ({ page }) => {
        for (let i = 0; i < 5; i++)
        {
          await createBlog(page, {...blog, title: `Blog ${i}`})
          await page.getByText(`Blog ${i}`).locator('..').getByTestId('view-button').click()
          const blogElement = page.getByTestId('blog-element').filter({ hasText: `Blog ${i}` })
          for (let j = 0; j < i; j++)
          {
            await blogElement.getByTestId('like-button').click()
          }
        }

        const blogElements = await page.getByTestId('blog-element').all()

        const blogLikes = await Promise.all(
          blogElements.map(async (element) => {
            const likeText = await element.getByTestId('like-button').locator('..').innerText() // Adjust based on how the likes are rendered
            return parseInt(likeText.match(/\d+/)[0], 10) // Extract and convert the number of likes
          })
        )

        const sortedLikes = [...blogLikes].sort((a, b) => b - a)
        expect(blogLikes).toEqual(sortedLikes)
      })
    })
  })

  describe('When logged in with a blog created by a different user', () => {
    const blog = {
      title: "a new blog",
      author: "Author",
      url: "www.url.com",
    }

    beforeEach(async ({ page, request }) => {
      await request.post('/api/users', {
      data: {
        name: 'Baz Qux',
        username: 'username2',
        password: 'password2'
      }
    })

      await loginWith(page, 'username', 'password')
      await createBlog(page, blog)
      await page.getByText('logout').click()
      await loginWith(page, 'username2', 'password2')
    })
    
    test('a blog cannot be deleted by a user who didnt create it', async ({ page }) => {
      await page.getByTestId('view-button').click()
      page.on('dialog', dialog => dialog.accept())
      await expect(page.getByTestId('delete-button')).not.toBeVisible()
    })
  })
})