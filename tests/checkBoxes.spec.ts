import{test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')
    //Select the VETERINARIANS menu item in the navigation bar
    await page.getByRole('button', {name:'VETERINARIANS'}).click()
    //Select "All"
    await page.locator('.dropdown-menu').locator('[routerlink="/vets"]').click()
     //Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')
})

test('Validate selected specialties', async ({page}) => {
    //Select the veterinarian "Helen Leary" and click "Edit Vet" button
    await page.getByRole('row', {name:'Helen Leary'}).getByRole('button', {name:'Edit Vet'}).click()
    //Add assertion of the "Specialties" field.
    await expect (page.locator('[for="spec"][class="col-sm-2 control-label"]')).toHaveText('Specialties')
    //The value "radiology" is displayed
    const vetSpecialties = page.locator('.selected-specialties')
    await expect (vetSpecialties).toContainText('radiology')
    //Click on the "Specialties" drop-down menu
    await vetSpecialties.click()
    //Add assertion that "radiology" specialty is checked
    await expect (page.getByRole('checkbox', {name: "radiology"})).toBeChecked()
    //Add assertion that "surgery" and "dentistry" specialties are unchecked
    await expect (page.getByRole('checkbox', {name: "surgery"})).not.toBeChecked()
    await expect (page.getByRole('checkbox', {name: "dentistry"})).not.toBeChecked()
    //Check the "surgery" item specialty and uncheck the "radiology" item speciality 
    await page.getByRole('checkbox', {name: "surgery"}).check({force: true})
    await page.getByRole('checkbox', {name: "radiology"}).uncheck({force: true})
    //Add assertion of the "Specialties" field displayed value "surgery"
    await expect (vetSpecialties).toContainText('surgery')
    //Check the "dentistry" item specialty
    await page.getByRole('checkbox', {name: "dentistry"}).check({force: true})
    //Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
    await expect (vetSpecialties).toHaveText('surgery, dentistry')
})

test('Select all specialties', async ({page}) => {
    //Select the veterinarian "Rafael Ortega" and click "Edit Vet" button
    await page.getByRole('row', {name:'Rafael Ortega'}).getByRole('button', {name:'Edit Vet'}).click()
    //Add assertion that "Specialties" field is displayed value "surgery"
    const vetSpecialties = page.locator('.selected-specialties')
    await expect (vetSpecialties).toContainText('surgery')
    //Click on the "Specialties" drop-down menu
    await vetSpecialties.click()
    //Check all specialties from the list & Add assertion that all specialties are checked
    const checkboxes = await page.getByRole('checkbox')
    for (const box of await checkboxes.all()) {
        await box.check({force: true})
        await expect(await box.isChecked()).toBeTruthy()
    } 
    //Add assertion that all checked specialities are displayed in the "Specialties" field
    await expect (vetSpecialties).toHaveText('surgery, radiology, dentistry')
})

test('Unselect all specialties', async ({page}) => {
    //Select the veterinarian "Linda Douglas" and click "Edit Vet" button
    await page.getByRole('row', {name:'Linda Douglas'}).getByRole('button', {name:'Edit Vet'}).click()
    //Add assertion of the "Specialties" field displayed value "surgery, dentistry"
    const vetSpecialties = page.locator('.selected-specialties')
    await expect (vetSpecialties).toContainText('dentistry, surgery')
    //Click on the "Specialties" drop-down menu
    await vetSpecialties.click()
    //Uncheck all specialties from the list & Add assertion that all specialties are unchecked
    const checkboxes = await page.getByRole('checkbox')
    for (const box of await checkboxes.all()) {
        await box.uncheck({force: true})
        await expect(await box.isChecked()).toBeFalsy()
    } 
    //Add assertion that "Specialties" field is empty
    await expect (vetSpecialties).toBeEmpty()
})