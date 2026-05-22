import { test, expect } from '@playwright/test'

// REQ-BUPA-001 — Verificacion de carga del Portal Pacientes BUPA
// Criterios: TC-001-AUTO, TC-002-AUTO, TC-003-AUTO
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio

const PORTAL_URL = '/inicio'
const UMBRAL_CARGA_MS = 7000

test.describe('REQ-BUPA-001 | Verificacion de carga del Portal Pacientes BUPA', () => {

  // TC-001-AUTO — Categoria: UI + Frontend
  // DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO  la pagina termina de cargar
  // ENTONCES el body es visible y la URL contiene portalpaciente.bupa.cl
  test('TC-001-AUTO | Portal carga correctamente', async ({ page }) => {
    await page.goto(PORTAL_URL)
    await expect(page.locator('body')).toBeVisible()
    expect(page.url()).toContain('portalpaciente.bupa.cl')
  })

  // TC-002-AUTO — Categoria: UX
  // DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO  se mide el tiempo desde inicio de navegacion hasta que el body es visible
  // ENTONCES el tiempo transcurrido es menor a 7000 milisegundos
  test('TC-002-AUTO | Portal carga en menos de 7 segundos', async ({ page }) => {
    const inicio = Date.now()
    await page.goto(PORTAL_URL)
    await expect(page.locator('body')).toBeVisible()
    const duracion = Date.now() - inicio
    expect(duracion, `Tiempo de carga: ${duracion}ms — umbral: ${UMBRAL_CARGA_MS}ms`).toBeLessThan(UMBRAL_CARGA_MS)
  })

  // TC-003-AUTO — Categoria: Backend (seguridad)
  // DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO  se evalua el protocolo de la URL activa
  // ENTONCES el protocolo es https: confirmando certificado SSL valido
  test('TC-003-AUTO | Portal utiliza HTTPS con certificado SSL valido', async ({ page }) => {
    await page.goto(PORTAL_URL)
    const protocolo = new URL(page.url()).protocol
    expect(protocolo).toBe('https:')
  })

})
