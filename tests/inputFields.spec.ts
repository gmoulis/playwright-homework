import{test, expect} from '@playwright/test'

const petTypesPage = '/pettypes'
const editPetTypePage = 'Edit Pet Type'
const petTypeNameField = 

test.beforeEach(async({page}) => {
    await page.goto('/')

    //Select the PET TYPES menu item in the navigation bar
    await page.getByTitle('pettypes').click()
    //assertion of the "Pet Types" text
    await expect(page.getByRole('heading')).toHaveText('Pet Types')

})

test('Test Case 1 : Update pet type', async ({page}) => {
        const checkIcon = '[class="glyphicon form-control-feedback glyphicon-ok"]'

    //Edit the "cat" pet type
    await page.getByRole('row', {name:"cat"}).click()
    const firstEditButton = page.getByRole('button', {name:'Edit'}).nth(0)
    await firstEditButton.click()
    //Assertion of the "Edit Pet Type" text displayed
    //await expect (page.getByRole('heading')).toHaveText('Edit Pet Type')
    await expect (page.getByRole('heading')).toHaveText(editPetTypePage)
    await page.locator('[class="col-sm-1 control-label"]')
    //Change the pet type name from "cat" to "rabbit" and click "Update" button
    const petTypeNameField = page.getByRole('textbox')
    await petTypeNameField.click()
    await petTypeNameField.clear({timeout: 10000})
    await petTypeNameField.fill('rabbit')
    await expect (page.locator(checkIcon)).toBeVisible()
    //await page.waitForSelector(checkIcon)
    const updateButton = page.getByRole('button', {name:'Update'})
    await updateButton.click()
    //Assertion that the first pet type in the list of types has a value "rabbit"
    await expect(page).toHaveURL(new RegExp(petTypesPage))
    await expect(page.locator('[id="0"]')).toHaveValue('rabbit')
    //Edit the "rabbit" pet type
    await firstEditButton.click()
    await petTypeNameField.click()
    await petTypeNameField.clear({timeout: 10000})
    //Change the pet type name back from "rabbit" to "cat" and click "Update" button
    await petTypeNameField.fill('cat')
    await expect (page.locator(checkIcon)).toBeVisible()
    await updateButton.click()
    await expect(page).toHaveURL(new RegExp(petTypesPage))
    // Assertion that the first pet type in the list of names has a value "cat"
    await expect(page.locator('[id="0"]')).toHaveValue('cat')
});

test('Test Case 2: Cancel pet type update', async ({page}) => {
    //Edit the "dog" pet type
    await page.getByRole('row', {name:"dog"}).click()
    await page.getByRole('button', {name:'Edit'}).nth(1).click()
    await expect (page.getByRole('heading')).toHaveText(editPetTypePage)
    //Type the new pet type name "moose"
    const petTypeNameField = page.getByRole('textbox')
    await petTypeNameField.click()
    await petTypeNameField.clear({timeout: 10000})
    await petTypeNameField.fill('moose')
    //Assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
    await expect(petTypeNameField).toHaveValue('moose')
    //Cancel
    await page.getByRole('button', {name:'Cancel'}).click()
    await expect(page).toHaveURL(new RegExp(petTypesPage))
    //Assertion the value "dog" is still displayed in the list of pet types
    await expect(page.locator('[id="1"]')).toHaveValue('dog')
});

test('Test Case 3: Pet type name is required validation', async ({page}) => {
    //Edit the "lizard" pet type
    await page.getByRole('row', {name:'lizard'}).click()
    await page.getByRole('button', {name:'Edit'}).nth(2).click()
    await expect(page).toHaveURL(new RegExp(petTypesPage))
    const petTypeNameField = page.getByRole('textbox')
    await petTypeNameField.click()
    //Clear the input field
    await petTypeNameField.clear({timeout: 10000})
    //Assertion for the "Name is required" message below the input field
    await expect(page.locator('[class="help-block"]')).toHaveText('Name is required')
    //Click on "Update" button
    await page.getByRole('button', {name:'Update'}).click()
    //Add assertion that "Edit Pet Type" page is still displayed
    await expect(page).toHaveURL(new RegExp(petTypesPage))
    //Click on the "Cancel" button
    await page.getByRole('button', {name:'Cancel'}).click()
    //Assertion that "Pet Types" page is displayed
    await expect(page).toHaveURL(new RegExp(petTypesPage))
})