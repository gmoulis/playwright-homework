import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    //Select the OWNERS menu item in the navigation bar
    await page.getByRole('button', { name: 'Owners' }).click()
    //Select "Search"
    await page.getByText('Search').click()
    //Add assertion of the "Owners" text displayed above the table with the list of Owners
    await expect(page.getByRole('heading')).toHaveText('Owners')
})

test('Validate selected pet types from the list', async ({ page }) => {
    //Select the first owner, "George Franklin"
    await page.getByRole('link', { name: 'George Franklin' }).click()
    //Add the assertion for the owner "Name", the value "George Franklin" is displayed
    await expect(
        page.getByRole('row', { name: 'Name' })
            .getByRole('cell', { name: 'George Franklin' })
    ).toBeVisible()
    //Add a new pet, Leo. There wasn't no displayed pet.
    await page.getByRole('button', { name: 'Add New Pet' }).click()
    await page.getByRole('textbox', { name: 'Name' }).fill('Leo')
    //Enter the Birth Date
    await page.locator('[name="birthDate"]').fill('2022/03/24')
    //Select the pet type "cat" from the drop-down menu
    const petTypeDropdown = page.locator('[name="pettype"]')
    await petTypeDropdown.selectOption('cat')
    //Save the new pet
    await page.getByRole('button', { name: 'Save Pet' }).click()
    //In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Leo"
    await page.locator('app-pet-list', { hasText: 'Leo' }).getByRole('button', { name: 'Edit Pet' }).click()
    //Add assertion of "Pet" text displayed as a header on the page
    await expect(page.getByRole('heading')).toHaveText('Pet')
    //Add the assertion "George Franklin" name is displayed in the "Owner" field
    await expect(page.locator('[name="owner_name"]')).toHaveValue('George Franklin')
    //Add the assertion that the value "cat" is displayed in the "Type" field 
    await expect(petTypeDropdown).toHaveValue('cat')
    //Using a loop, select the values from the drop-down one by one, and add the assertion that every selected value from the drop-down is displayed in the "Type" field
    const types = await page.locator('[name="pettype"] option').allTextContents()
    for (const type of types) {
        await petTypeDropdown.selectOption(type)
        await expect(page.locator('[name="type1"]')).toHaveValue(type)
    }
    //Delete the pet "Leo". Back button doesn't work.
    await page.getByRole('button', { name: "Update Pet" }).click()
    await page.getByRole('button', { name: "Delete Pet" }).click()
})

test('Validate the pet type update', async ({ page }) => {
    // Select the owner "Eduardo Rodriquez"
    await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()
    // In the "Pets and Visits" section, click on "Edit Pet" button for the pet with the name "Rosy"
    const rosyPetSection = await page.locator('app-pet-list', { hasText: 'Rosy' })
    await rosyPetSection.getByRole('button', { name: "Edit Pet" }).click()
    // Add the assertion that the name "Rosy" is displayed in the input field "Name"
    await expect(page.locator('[name="name"]')).toHaveValue('Rosy')
    // Add the assertion the value "dog" is displayed in the "Type" field
    const petTypeDropdown = page.locator('[name="pettype"]')
    const petTypeField = page.locator('[name="type1"]')
    await expect(petTypeField).toHaveValue('dog')
    // From the drop-down menu, select the value "bird"
    await petTypeDropdown.selectOption('bird')
    // On the "Pet details" page, add the assertion the value "bird" is displayed in the "Type" field as well as drop-down input field
    await expect(petTypeField).toHaveValue('bird')
    await expect(petTypeDropdown).toHaveValue('bird')
    // Select the "Update Pet" button
    await page.getByRole('button', { name: "Update Pet" }).click()
    // On the "Owner Information" page, add the assertion that the pet "Rosy" has a new value of the Type "bird"
    await expect(rosyPetSection.locator('dd').nth(2)).toHaveText('bird')
    // Select the "Edit Pet" button one more time, and perform steps 6-10 to revert the selection of the pet type "bird" to its initial value "dog"
    await rosyPetSection.getByRole('button', { name: "Edit Pet" }).click()
    await expect(petTypeField).toHaveValue('bird')
    await petTypeDropdown.selectOption('dog')
    await expect(petTypeField).toHaveValue('dog')
    await expect(petTypeDropdown).toHaveValue('dog')
    await page.getByRole('button', { name: "Update Pet" }).click()
})
