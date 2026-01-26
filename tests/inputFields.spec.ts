import{test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')

    //Select the PET TYPES menu item in the navigation bar
    await page.getByTitle('pettypes').click()
    //assertion of the "Pet Types" text
    await expect(page.getByRole('heading')).toHaveText('Pet Types')

})

test('Test Case 1 : Update pet type', async ({page}) => {
    //Edit the "cat" pet type
    await page.getByRole('row', {name:"cat"}).getByRole('button', {name:'Edit'}).click()
    //Assertion of the "Edit Pet Type" text displayed
    await expect (page.getByRole('heading')).toHaveText('Edit Pet Type')
    //Change the pet type name from "cat" to "rabbit" and click "Update" button
    const petTypeNameField = page.getByRole('textbox')
    await petTypeNameField.click()
    await expect (page.getByRole('textbox')).toHaveValue('cat')
    await petTypeNameField.fill('rabbit')
    await page.getByRole('button', {name:'Update'}).click()
    //Assertion that the first pet type in the list of types has a value "rabbit"
    await expect(page).toHaveURL('/pettypes')
    await expect(page.locator('[id="0"]')).toHaveValue('rabbit')
    //Edit the "rabbit" pet type
    await page.getByRole('row', {name:"rabbit"}).getByRole('button', {name:'Edit'}).click()
    await petTypeNameField.click()
    await expect (page.getByRole('textbox')).toHaveValue('rabbit')
    //Change the pet type name back from "rabbit" to "cat" and click "Update" button
    await petTypeNameField.fill('cat')
    await page.getByRole('button', {name:'Update'}).click()
    await expect(page).toHaveURL('/pettypes')
    // Assertion that the first pet type in the list of names has a value "cat"
    await expect(page.locator('[id="0"]')).toHaveValue('cat')
});

test('Test Case 2: Cancel pet type update', async ({page}) => {
    //Edit the "dog" pet type
    await page.getByRole('row', {name:"dog"}).getByRole('button', {name:'Edit'}).click()
    await expect (page.getByRole('heading')).toHaveText('Edit Pet Type')
    //Type the new pet type name "moose"
    const petTypeNameField = page.getByRole('textbox')
    await petTypeNameField.click()
    await expect (page.getByRole('textbox')).toHaveValue('dog')
    await petTypeNameField.fill('moose')
    //Assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
    await expect(petTypeNameField).toHaveValue('moose')
    //Cancel
    await page.getByRole('button', {name:'Cancel'}).click()
    await expect(page).toHaveURL('/pettypes')
    //Assertion the value "dog" is still displayed in the list of pet types
    await expect(page.locator('[id="1"]')).toHaveValue('dog')
});

test('Test Case 3: Pet type name is required validation', async ({page}) => {
    //Edit the "lizard" pet type
    await page.getByRole('row', {name:'lizard'}).getByRole('button', {name:'Edit'}).click()
    await expect (page.getByRole('heading')).toHaveText('Edit Pet Type')
    const petTypeNameField = page.getByRole('textbox')
    await petTypeNameField.click()
    //Clear the input field
    await expect (page.getByRole('textbox')).toHaveValue('lizard')
    await petTypeNameField.clear()
    //Assertion for the "Name is required" message below the input field
    await expect(page.locator('[class="help-block"]')).toHaveText('Name is required')
    //Click on "Update" button
    await page.getByRole('button', {name:'Update'}).click()
    //Add assertion that "Edit Pet Type" page is still displayed
    await expect (page.getByRole('heading')).toHaveText('Edit Pet Type')
    //Click on the "Cancel" button
    await page.getByRole('button', {name:'Cancel'}).click()
    //Assertion that "Pet Types" page is displayed
    await expect(page).toHaveURL('/pettypes')
})