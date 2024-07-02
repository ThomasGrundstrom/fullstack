const { test, describe, expect, beforeEach } = require('@playwright/test')
const exp = require('constants')

describe('Blog list', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const title = await page.getByRole('heading', { name: 'Login' })
    await expect(title).toBeVisible()
    const button = await page.getByRole('button', { name: 'login' })
    await expect(button).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('s')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'view' })).not.toBeVisible()

      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('write title here').fill('Test blog')
      await page.getByPlaceholder('write author here').fill('Test Author')
      await page.getByPlaceholder('write url here').fill('https://testurl.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('a new blog Test blog by Test Author added')).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('write title here').fill('Test blog')
      await page.getByPlaceholder('write author here').fill('Test Author')
      await page.getByPlaceholder('write url here').fill('https://testurl.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes: 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('a blog can be removed by the correct account', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('write title here').fill('Test blog')
      await page.getByPlaceholder('write author here').fill('Test Author')
      await page.getByPlaceholder('write url here').fill('https://testurl.com')

      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        if (dialog.type() === 'confirm') {
          await dialog.accept()
        }
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('removed blog Test blog by Test Author')).toBeVisible()
    })

    test('the remove button is visible only to the account that created the blog', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('write title here').fill('Test blog')
      await page.getByPlaceholder('write author here').fill('Test Author')
      await page.getByPlaceholder('write url here').fill('https://testurl.com')

      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Superuser',
          username: 'root',
          password: 'sekret'
        }
      })

      await page.getByTestId('username').fill('root')
      await page.getByTestId('password').fill('sekret')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByText('https://testurl.com')).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})