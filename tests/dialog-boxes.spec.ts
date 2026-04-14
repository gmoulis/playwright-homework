import { test, expect } from '@playwright/test'

test('Add and delete pet type', async ({ page }) => {
    await page.goto('/')
    // Select the PET TYPES menu item in the navigation bar
    await page.getByTitle('pettypes').click()
    // On the "Pet Types" page, add an assertion of the "Pet Types" text displayed above the table with the list of pet types
    await expect(page.getByRole('heading')).toHaveText('Pet Types')
    // Click on the "Add" button
    await page.getByRole('button', { name: 'Add' }).click()
    // Add assertions of "New Pet Type" section title, "Name" header for the input field and the input field is visible
    await expect(page.getByRole('heading', { name: 'New Pet Type' })).toBeVisible()
    await expect(page.locator('label')).toHaveText('Name')
    await expect(page.locator('[name="name"]')).toBeVisible()
    // Add a new pet type with the name "pig" and click "Save" button
    await page.locator('[name="name"]').fill('pig')
    await page.getByRole('button', { name: 'Save' }).click()
    // Add an assertion that the last item in the list of pet types has the value of "pig"
    await expect(page.locator('[name="pettype_name"]').last()).toHaveValue('pig')
    // Click on the "Delete" button for the "pig" pet type
    // Add an assertion to validate the message of the dialog box "Delete the pet type?"
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Delete the pet type?')
        // Click on the OK button on the dialog box
        await dialog.accept()
    })
    await page.getByRole('button', { name: 'Delete' }).last().click()
    // Add an assertion that the last item in the list of pet types is not the "pig"
    await page.waitForResponse('**/pettypes/*')
    await expect(page.locator('[name="pettype_name"]').last()).not.toHaveValue('pig')
})