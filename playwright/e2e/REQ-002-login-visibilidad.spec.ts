import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import credenciales from '../../cypress/fixtures/auth/credenciales-validas.json'

// REQ-BUPA-002 — Verificacion de visibilidad y accesibilidad del formulario de login
// Criterios: TC-001-AUTO, TC-002-AUTO, TC-003-AUTO, TC-004-AUTO
// TC-005-AUTO (Tab navigation) — pendiente implementacion
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio
// Nota: el portal tiene login de 2 pasos — password solo aparece despues de ingresar RUT

const PORTAL_URL = '/inicio'

test.describe('REQ-BUPA-002 | Verificacion de visibilidad y accesibilidad del formulario de login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(PORTAL_URL)
  })

  // TC-001-AUTO — Campo RUT es visible
  // Categoria: UI + Frontend
  // DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO  Angular termina de renderizar el componente de login
  // ENTONCES el elemento input[name="rut"] es visible en pantalla
  test('TC-001-AUTO | Campo RUT es visible', async ({ page }) => {
    await expect(page.locator('input[name="rut"]')).toBeVisible()
  })

  // TC-002-AUTO — Campo password es visible y de tipo password
  // Categoria: UI + Backend (seguridad)
  // DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO  el paciente ingresa el RUT y avanza al paso 2 del login
  // ENTONCES el elemento input[name="current-password"] es visible y su tipo es password
  // Nota: el portal usa login de 2 pasos — se debe ingresar RUT antes de que aparezca el campo password
  test('TC-002-AUTO | Campo password es visible y de tipo password', async ({ page }) => {
    await page.locator('input[name="rut"]').fill(credenciales.rut)
    await page.locator('button[type="submit"]').first().click({ force: true })
    const campoPassword = page.locator('input[name="current-password"]')
    await expect(campoPassword).toBeVisible({ timeout: 10000 })
    await expect(campoPassword).toHaveAttribute('type', 'password')
  })

  // TC-003-AUTO — Boton Continuar (paso 1) es visible
  // Categoria: UI
  // DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO  Angular termina de renderizar el componente de login
  // ENTONCES el primer button[type="submit"] (Continuar) es visible en pantalla
  test('TC-003-AUTO | Boton Continuar es visible', async ({ page }) => {
    await expect(page.locator('button[type="submit"]').first()).toBeVisible()
  })

  // TC-004-AUTO — Pagina cumple WCAG 2.1 AA
  // Categoria: Accesibilidad
  // DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO  axe evalua la pagina con reglas wcag2a y wcag2aa
  // ENTONCES no se detectan violaciones de accesibilidad criticas del formulario
  // Nota: se excluye nested-interactive — violacion conocida de Angular Material (mat-expansion-panel)
  test('TC-004-AUTO | Pagina cumple WCAG 2.1 AA sin violaciones criticas', async ({ page }) => {
    const resultados = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['nested-interactive'])
      .analyze()
    expect(resultados.violations).toEqual([])
  })

  // TC-005-AUTO — Tab navega en orden logico RUT > password > boton
  // Categoria: UX (accesibilidad teclado)
  // PENDIENTE — requiere inspeccion del DOM real para confirmar orden de foco
  test.skip('TC-005-AUTO | Tab navega en orden logico RUT > password > boton', async ({ page }) => {
    await page.locator('input[name="rut"]').focus()
    await page.keyboard.press('Tab')
    await expect(page.locator('input[name="current-password"]')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.locator('button[type="submit"]')).toBeFocused()
  })

})
