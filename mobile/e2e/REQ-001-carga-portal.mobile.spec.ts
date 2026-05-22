import { test, expect } from '@playwright/test'

// REQ-BUPA-001 — Verificacion de carga del Portal Pacientes BUPA
// Spec mobile: REQ-001-carga-portal.mobile.spec.ts
// Criterios: TC-001-AUTO, TC-002-AUTO, TC-003-AUTO, TC-004-MOBILE, TC-005-MOBILE
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio

const PORTAL_URL      = '/inicio'
const UMBRAL_CARGA_MS = 7000

test.describe('REQ-BUPA-001 | Carga del Portal — Mobile', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(PORTAL_URL)
  })

  // TC-001-AUTO — Categoria: UI + Frontend
  // DADO    el paciente abre el portal desde un dispositivo movil
  // CUANDO  la pagina termina de cargar
  // ENTONCES el body es visible y la URL contiene portalpaciente.bupa.cl
  test('TC-001-AUTO | Portal carga correctamente en mobile', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
    expect(page.url()).toContain('portalpaciente.bupa.cl')
  })

  // TC-002-AUTO — Categoria: UX
  // DADO    el paciente abre el portal desde un dispositivo movil
  // CUANDO  se mide el tiempo de carga
  // ENTONCES el tiempo es menor a 7000ms
  test('TC-002-AUTO | Portal carga en menos de 7 segundos en mobile', async ({ page }) => {
    const inicio = Date.now()
    await page.goto(PORTAL_URL)
    await expect(page.locator('body')).toBeVisible()
    const duracion = Date.now() - inicio
    expect(duracion, `Tiempo de carga mobile: ${duracion}ms — umbral: ${UMBRAL_CARGA_MS}ms`).toBeLessThan(UMBRAL_CARGA_MS)
  })

  // TC-003-AUTO — Categoria: Backend (seguridad)
  // DADO    el paciente abre el portal desde un dispositivo movil
  // CUANDO  se evalua el protocolo de la URL
  // ENTONCES el protocolo es https:
  test('TC-003-AUTO | Portal utiliza HTTPS en mobile', async ({ page }) => {
    const protocolo = new URL(page.url()).protocol
    expect(protocolo).toBe('https:')
  })

  // TC-004-MOBILE — Categoria: UX responsive
  // DADO    el paciente usa un dispositivo movil
  // CUANDO  la pagina carga
  // ENTONCES no hay scroll horizontal — el contenido cabe en el viewport
  test('TC-004-MOBILE | Sin scroll horizontal en mobile', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(
      scrollWidth,
      `scrollWidth (${scrollWidth}px) supera clientWidth (${clientWidth}px) — hay scroll horizontal`
    ).toBeLessThanOrEqual(clientWidth)
  })

  // TC-005-MOBILE — Categoria: UI responsive
  // DADO    el paciente usa un dispositivo movil
  // CUANDO  la pagina carga
  // ENTONCES el body ocupa el ancho completo del viewport sin desbordarse
  test('TC-005-MOBILE | Body ocupa el ancho completo del viewport', async ({ page }) => {
    const bodyWidth   = await page.evaluate(() => document.body.scrollWidth)
    const windowWidth = await page.evaluate(() => window.innerWidth)
    expect(
      bodyWidth,
      `Body (${bodyWidth}px) desborda el viewport (${windowWidth}px)`
    ).toBeLessThanOrEqual(windowWidth + 5) // margen de 5px por bordes
  })

})
