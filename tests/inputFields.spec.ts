import{test, expect} from '@playwright/test'
import {text} from "node:stream/consumers";

test.beforeEach(async({page}) => {
    await page.goto('/')

    //Select the PET TYPES menu item in the navigation bar
    await page.getByTitle('pettypes').click()
    //assertion of the "Pet Types" text
    const petTypesHead = page.getByRole('heading')
    await expect (petTypesHead).toHaveText('Pet Types')
    await page.waitForTimeout(10000)

})

const petTypesPage = 'https://petclinic.bondaracademy.com/pettypes'

test('Test Case 1 : Update pet type', async ({page}) => {
    const checkIcon = '[class="glyphicon form-control-feedback glyphicon-ok"]'

    //Edit the "cat" pet type
    await page.getByRole('row', {name:"cat"}).first().click()
    const editButton = page.getByRole('button', {name:'Edit'}).nth(0)
    await editButton.click()
    //Assertion of the "Edit Pet Type" text displayed
    await expect(page).toHaveURL('https://petclinic.bondaracademy.com/pettypes/2500/edit')
    const editPetTypeHead = page.getByRole('heading')
    await expect (editPetTypeHead).toHaveText('Edit Pet Type')
    await page.waitForTimeout(5000)
    //Change the pet type name from "cat" to "rabbit" and click "Update" button
    const editPetField = page.locator('[id="name"]')
    await editPetField.clear({timeout: 10000})
    await editPetField.fill('rabbit')
    //await page.waitForSelector(checkIcon)
    const updateButton = page.getByRole('button', {name:'Update'})
    await updateButton.click()
    await page.waitForTimeout(10000)
    //Assertion that the first pet type in the list of types has a value "rabbit"
    await expect(page).toHaveURL(petTypesPage)
    await expect(page.locator('[id="0"]')).toHaveValue('rabbit')
    //Edit the "rabbit" pet type
    await editButton.click()
    await editPetField.clear({timeout: 10000})
    await page.waitForTimeout(10000)
    //Change the pet type name back from "rabbit" to "cat" and click "Update" button
    await editPetField.fill('cat')
    await page.locator(checkIcon).isVisible()
    await page.getByRole('button', {name:'Update'}).click()
    await page.waitForTimeout(15000)
    await expect(page).toHaveURL(petTypesPage)
    // Assertion that the first pet type in the list of names has a value "cat"
    await expect(page.locator('[id="0"]')).toHaveValue('cat')
});

test('Test Case 2: Cancel pet type update', async ({page}) => {
    //Edit the "dog" pet type
    await page.getByRole('row', {name:"dog"}).click()
    await page.getByRole('button', {name:'Edit'}).nth(1).click()
    await expect(page).toHaveURL('https://petclinic.bondaracademy.com/pettypes/2501/edit')
    await page.waitForTimeout(5000)
    //Type the new pet type name "moose"
    const editPetField = page.locator('[id="name"]')
    await editPetField.clear({timeout: 10000})
    await editPetField.fill('moose')
    //Assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
    await expect(editPetField).toHaveValue('moose')
    //Cancel
    await page.getByRole('button', {name:'Cancel'}).click()
    await page.waitForTimeout(15000)
    await expect(page).toHaveURL(petTypesPage)
    //Assertion the value "dog" is still displayed in the list of pet types
    await expect(page.locator('[id="1"]')).toHaveValue('dog')
});

test('Test Case 3: Pet type name is required validation', async ({page}) => {
    const editPetPage = 'https://petclinic.bondaracademy.com/pettypes/2502/edit'

    //Edit the "lizard" pet type
    await page.getByRole('row', {name:'lizard'}).click()
    await page.getByRole('button', {name:'Edit'}).nth(2).click()
    await expect(page).toHaveURL(editPetPage)
    await page.waitForTimeout(5000)
    const editPetField = page.locator('[id="name"]')
    //Clear the input field
    await editPetField.clear({timeout: 10000})
    //Assertion for the "Name is required" message below the input field
    await expect(page.locator('[class="help-block"]')).toHaveText('Name is required')
    //Click on "Update" button
    await page.getByRole('button', {name:'Update'}).click()
    //Add assertion that "Edit Pet Type" page is still displayed
    await expect(page).toHaveURL(editPetPage)
    //Click on the "Cancel" button
    await page.getByRole('button', {name:'Cancel'}).click()
    await page.waitForTimeout(15000)
    //Assertion that "Pet Types" page is displayed
    await expect(page).toHaveURL(petTypesPage)
})