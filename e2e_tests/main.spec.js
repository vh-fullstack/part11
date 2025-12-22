const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Library Application', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('initial page renders correctly', async ({ page }) => {
    // Ensure we are starting in the right state (logged out)
    await expect(page.getByRole('button', { name: 'authors' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    // Ensure protected buttons are NOT visible yet
    await expect(page.getByRole('button', { name: 'add book' })).not.toBeVisible()
  })

  describe('Login', () => {
    // Setup specific to Login: Navigate to the login form
    beforeEach(async ({ page }) => {
      await page.getByRole('navigation')
        .getByRole('button', { name: 'login' })
        .click()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      // We use getByLabel because inputs are wrapped in <label> tags.
      await page.getByLabel('username').fill('john')
      await page.getByLabel('password').fill('secret')

      // Action: Submit
      // We specify 'name' because there might be other buttons on the page
      await page.locator('form')
        .getByRole('button', { name: 'login' })
        .click()

      await page.waitForLoadState('networkidle')

      // Assertion: How do we know we are logged in?
      // The UI should change. The "add book" button should appear.
      await expect(page.getByRole('button', { name: 'add book' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()

      // The login button should be gone
      await expect(page.getByRole('button', { name: 'login' })).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('wronguser')
      await page.getByLabel('password').fill('wrongpass')
      await page.locator('form')
        .getByRole('button', { name: 'login' })
        .click()

      // Assertion for failure
      // We expect to STILL be on the login page (or see an error)
      // Since your component doesn't render an error message div yet,
      // we check that the "add book" button is STILL hidden.
      await expect(page.getByRole('button', { name: 'add book' })).not.toBeVisible()
    })
  })
})