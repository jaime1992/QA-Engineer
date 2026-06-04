# Guia Postman + Newman — Referencia Completa

Referencia practica para testing de APIs REST con Postman y Newman.
Todos los ejemplos usan **JSONPlaceholder** (`https://jsonplaceholder.typicode.com`) — API publica gratuita, sin autenticacion, siempre disponible.

---

## 1. Donde encaja en la Piramide de Testing

```
        /\
       /E2E\        ← Cypress / Playwright (UI, browser)
      /------\
     /Integrac\     ← Postman / Newman  ← ACÁ
    /----------\
   / Unitarias  \   ← Jest / Go test
  /--------------\
```

| Capa | Herramienta | Qué prueba |
|---|---|---|
| E2E / UI | Cypress, Playwright | Flujos completos desde el browser |
| **Integracion** | **Postman, Newman** | **APIs REST — contratos, datos, autenticacion** |
| Unitarias | Jest, Go test | Funciones y componentes aislados |

**Postman prueba directamente el HTTP** — sin abrir browser, sin UI. Valida que el backend cumple el contrato definido en el SDD.

---

## 2. Estructura de una Coleccion

```
Coleccion: Portal Pacientes BUPA
│
├── Variables de coleccion (base_url, token)
│
├── 📁 REQ-001 — Carga del Portal
│     ├── TC-001 | Portal responde 200
│     ├── TC-002 | Headers de seguridad presentes
│     └── TC-003 | HTTP redirige a HTTPS
│
├── 📁 REQ-003 — Login Exitoso
│     ├── TC-001 | Login retorna token
│     └── TC-002 | Token permite acceder a recurso protegido
│
└── 📁 REQ-004 — Credenciales Invalidas
      ├── TC-001 | Login RUT invalido retorna 401
      └── TC-002 | Login password incorrecto retorna 401
```

**Regla:** una coleccion por producto, carpetas por REQ. Igual que los specs de Cypress y Playwright.

---

## 3. Variables

Las variables evitan repetir URLs, tokens y datos en cada request.

### Tipos de variables (orden de precedencia: mayor a menor)

| Tipo | Scope | Cuando usarlo |
|---|---|---|
| **Global** | Todos los workspaces | Raro — evitar |
| **Environment** | Un ambiente (local, staging, prod) | URL base por ambiente |
| **Collection** | Una coleccion | Token, datos compartidos entre requests |
| **Local** | Un request o script | Variables temporales en scripts |

### Crear variable de coleccion

1. Click en la coleccion → pestaña **Variables**
2. Agregar:

| Variable | Initial value | Current value |
|---|---|---|
| `base_url` | `https://jsonplaceholder.typicode.com` | `https://jsonplaceholder.typicode.com` |
| `token` | *(vacio)* | *(se llena por script)* |

### Usar variable en un request

```
{{base_url}}/posts
{{base_url}}/users/{{user_id}}
```

### Setear variable desde un script (Test tab)

```javascript
// Guardar token de una respuesta para usarlo en el siguiente request
const body = pm.response.json()
pm.collectionVariables.set('token', body.token)

// Guardar ID dinamico
pm.collectionVariables.set('post_id', body.id)
```

---

## 4. Requests — GET, POST, PUT, PATCH, DELETE

### Que hace cada metodo

| Metodo | Para que sirve | Idempotente | Ejemplo real BUPA |
|---|---|---|---|
| `GET` | Obtener un recurso sin modificarlo | Si — repetirlo da el mismo resultado | Traer el perfil de un paciente |
| `POST` | Crear un recurso nuevo | No — cada llamada crea uno nuevo | Crear una cita medica |
| `PUT` | Reemplazar un recurso **completo** | Si — el resultado es siempre el mismo | Reemplazar todos los datos de un paciente |
| `PATCH` | Modificar solo **campos especificos** | Si | Cambiar solo el telefono del paciente |
| `DELETE` | Eliminar un recurso | Si — eliminar algo ya eliminado no cambia el resultado | Cancelar una cita |
| `HEAD` | Igual que GET pero **sin body** — solo retorna los headers | Si | Verificar si el portal responde y que headers tiene, sin descargar la pagina completa |
| `OPTIONS` | Pregunta al servidor **que metodos permite** en un endpoint — usado en CORS | Si | Verificar que el endpoint de login acepta POST y no GET |

> **Idempotente:** llamar al endpoint una o diez veces produce el mismo estado final. GET, PUT, PATCH, DELETE, HEAD y OPTIONS lo son. POST no.

### Cuando usar HEAD y OPTIONS en QA

| Metodo | Caso de uso en testing |
|---|---|
| `HEAD` | Verificar que un endpoint existe y esta disponible **sin consumir ancho de banda** (util en health checks y smoke tests rapidos) |
| `HEAD` | Validar headers de seguridad (`Content-Type`, `Strict-Transport-Security`) sin descargar el body |
| `OPTIONS` | Verificar configuracion **CORS** — que el servidor permite llamadas desde el frontend Angular |
| `OPTIONS` | Confirmar que un endpoint acepta los metodos correctos antes de hacer el request real |

### Ejemplo HEAD en Postman

```
HEAD {{base_url}}/inicio

Tests:
```
```javascript
pm.test('TC-001 | Servidor disponible (HEAD)', () => {
  pm.response.to.have.status(200)
})

pm.test('TC-002 | Content-Type presente sin descargar body', () => {
  pm.response.to.have.header('Content-Type')
})
```

### Ejemplo OPTIONS en Postman

```
OPTIONS {{base_url}}/api/auth/login

Tests:
```
```javascript
pm.test('TC-001 | Endpoint acepta POST', () => {
  const allow = pm.response.headers.get('Allow') || pm.response.headers.get('Access-Control-Allow-Methods')
  pm.expect(allow).to.include('POST')
})

pm.test('TC-002 | CORS permite origen del frontend', () => {
  pm.response.to.have.header('Access-Control-Allow-Origin')
})

### GET — Obtener recurso

```
GET {{base_url}}/posts
GET {{base_url}}/posts/1
GET {{base_url}}/users/1
GET {{base_url}}/posts?userId=1
```

### POST — Crear recurso

```
POST {{base_url}}/posts

Body (raw → JSON):
{
  "title": "Nuevo post de prueba",
  "body": "Contenido del post",
  "userId": 1
}
```

### PUT — Reemplazar recurso completo

```
PUT {{base_url}}/posts/1

Body (raw → JSON):
{
  "id": 1,
  "title": "Titulo actualizado",
  "body": "Contenido actualizado",
  "userId": 1
}
```

### PATCH — Actualizar campos especificos

```
PATCH {{base_url}}/posts/1

Body (raw → JSON):
{
  "title": "Solo el titulo cambia"
}
```

### DELETE — Eliminar recurso

```
DELETE {{base_url}}/posts/1
```

### Headers comunes

| Header | Valor | Cuando usarlo |
|---|---|---|
| `Content-Type` | `application/json` | En POST, PUT, PATCH con body JSON |
| `Authorization` | `Bearer {{token}}` | En endpoints protegidos |
| `Accept` | `application/json` | Para indicar que esperas JSON |

---

## 5. Assertions con pm.test()

Las assertions van en la pestaña **Tests** de cada request. Se ejecutan automaticamente despues de recibir la respuesta.

### Estructura basica

```javascript
pm.test('Nombre del test', function () {
  // assertion aqui
})
```

### Multiples tests en un request

```javascript
pm.test('TC-001 | Status code es 200', function () {
  pm.response.to.have.status(200)
})

pm.test('TC-002 | Respuesta es JSON', function () {
  pm.response.to.be.json
})

pm.test('TC-003 | Body tiene la propiedad id', function () {
  const body = pm.response.json()
  pm.expect(body).to.have.property('id')
})
```

---

## 6. Tests de Status Code, Body, Headers y Tiempo

### Status Code

```javascript
// Status exacto
pm.test('Status 200', () => pm.response.to.have.status(200))
pm.test('Status 201', () => pm.response.to.have.status(201))
pm.test('Status 401', () => pm.response.to.have.status(401))
pm.test('Status 404', () => pm.response.to.have.status(404))

// Familia de status (2xx, 4xx)
pm.test('Respuesta exitosa', () => pm.expect(pm.response.code).to.be.within(200, 299))
```

### Body

```javascript
const body = pm.response.json()

// Propiedad existe
pm.test('Body tiene id', () => pm.expect(body).to.have.property('id'))

// Valor exacto
pm.test('userId es 1', () => pm.expect(body.userId).to.eql(1))

// Tipo de dato
pm.test('title es string', () => pm.expect(body.title).to.be.a('string'))

// Array no vacio
pm.test('Lista tiene elementos', () => pm.expect(body).to.be.an('array').that.is.not.empty)

// Longitud
pm.test('Lista tiene 100 posts', () => pm.expect(body).to.have.lengthOf(100))

// Propiedad con valor especifico en array
pm.test('Primer post tiene id 1', () => pm.expect(body[0].id).to.eql(1))

// Contiene string
pm.test('Title contiene texto', () => pm.expect(body.title).to.include('sunt'))
```

### Headers

```javascript
// Header existe
pm.test('Content-Type presente', () => {
  pm.response.to.have.header('Content-Type')
})

// Header con valor especifico
pm.test('Content-Type es JSON', () => {
  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json')
})
```

### Tiempo de respuesta

```javascript
// Responde en menos de 500ms
pm.test('Tiempo de respuesta < 500ms', () => {
  pm.expect(pm.response.responseTime).to.be.below(500)
})

// Responde en menos de 2000ms
pm.test('Tiempo de respuesta < 2s', () => {
  pm.expect(pm.response.responseTime).to.be.below(2000)
})
```

---

## 7. Flujos Encadenados — Usar Respuesta en el Siguiente Request

Permite que el resultado de un request alimente al siguiente. Util para: login → token → request autenticado.

### Paso 1 — Request de login (guarda el token)

**POST** `{{base_url}}/auth/login`

Pestaña **Tests:**
```javascript
pm.test('Login exitoso', () => pm.response.to.have.status(200))

// Guardar token para el siguiente request
const body = pm.response.json()
pm.collectionVariables.set('token', body.token)
pm.collectionVariables.set('user_id', body.id)
```

### Paso 2 — Request siguiente (usa el token)

**GET** `{{base_url}}/users/{{user_id}}`

Pestaña **Headers:**
```
Authorization: Bearer {{token}}
```

Pestaña **Tests:**
```javascript
pm.test('Perfil cargado correctamente', () => {
  const body = pm.response.json()
  pm.expect(body.id).to.eql(parseInt(pm.collectionVariables.get('user_id')))
})
```

### Ejemplo con JSONPlaceholder

**Request 1 — Crear post (guarda el id)**

POST `{{base_url}}/posts`
```javascript
// Tests tab
const body = pm.response.json()
pm.collectionVariables.set('post_id', body.id)
pm.test('Post creado con id', () => pm.expect(body).to.have.property('id'))
```

**Request 2 — Obtener el post creado**

GET `{{base_url}}/posts/{{post_id}}`
```javascript
// Tests tab
pm.test('Post obtenido correctamente', () => pm.response.to.have.status(200))
```

---

## 8. Fixtures / Datos de Prueba (Data Files)

Para correr el mismo request con multiples sets de datos (equivalente a `cy.fixture` en Cypress).

### Archivo CSV `datos-posts.csv`

```csv
titulo,cuerpo,userId
"Post de prueba 1","Contenido 1",1
"Post de prueba 2","Contenido 2",2
"Post invalido","",999
```

### Archivo JSON `datos-posts.json`

```json
[
  { "titulo": "Post de prueba 1", "cuerpo": "Contenido 1", "userId": 1 },
  { "titulo": "Post de prueba 2", "cuerpo": "Contenido 2", "userId": 2 }
]
```

### Usar en el request

En el body del request:
```json
{
  "title": "{{titulo}}",
  "body": "{{cuerpo}}",
  "userId": {{userId}}
}
```

### Correr con Newman y data file

```bash
newman run coleccion.json --iteration-data datos-posts.csv
newman run coleccion.json --iteration-data datos-posts.json
```

---

## 9. Environments — Local, Staging, Produccion

Permite cambiar la URL base y credenciales sin tocar los requests.

### Crear environment

1. Click en el icono de **Environments** (ojo en la barra lateral)
2. **"+"** para crear nuevo
3. Nombre: `BUPA — Local`

| Variable | Value |
|---|---|
| `base_url` | `http://localhost:3000` |
| `token` | *(vacio — se llena por script)* |

Repetir para `BUPA — Staging` y `BUPA — Produccion` con sus URLs correspondientes.

### Seleccionar environment

Dropdown en la esquina superior derecha de Postman → seleccionar el ambiente antes de correr.

### Con Newman

```bash
# Correr con ambiente especifico
newman run coleccion.json --environment staging.json
newman run coleccion.json --environment produccion.json
```

---

## 10. Newman — Correr desde Terminal y CI/CD

Newman es el CLI de Postman. Permite correr colecciones sin abrir la interfaz grafica — ideal para pipelines CI/CD.

### Instalacion

```bash
npm install --save-dev newman
```

### Exportar coleccion desde Postman

1. Click derecho en la coleccion → **Export**
2. Formato: **Collection v2.1**
3. Guardar en `postman/colecciones/portal-pacientes-bupa.json`

### Comandos basicos

```bash
# Correr coleccion completa
npx newman run postman/colecciones/portal-pacientes-bupa.json

# Correr con environment
npx newman run postman/colecciones/portal-pacientes-bupa.json \
  --environment postman/environments/staging.json

# Correr solo una carpeta
npx newman run postman/colecciones/portal-pacientes-bupa.json \
  --folder "REQ-001 — Carga del Portal"

# Con reporte HTML (requiere newman-reporter-htmlextra)
npx newman run coleccion.json --reporters cli,htmlextra \
  --reporter-htmlextra-export postman/reportes/reporte.html

# Con data file
npx newman run coleccion.json --iteration-data datos.csv
```

### Instalar reporter HTML

```bash
npm install --save-dev newman-reporter-htmlextra
```

### Scripts en package.json

```json
"api:test": "npx newman run postman/colecciones/portal-pacientes-bupa.json",
"api:smoke": "npx newman run postman/colecciones/portal-pacientes-bupa.json --folder 'REQ-001 — Carga del Portal'",
"api:report": "npx newman run postman/colecciones/portal-pacientes-bupa.json --reporters cli,htmlextra --reporter-htmlextra-export postman/reportes/reporte.html"
```

---

## 11. Exportar e Importar — Versionado en Git

Las colecciones y environments se exportan como JSON y se versionan en Git.

### Estructura de carpetas en el proyecto

```
postman/
  colecciones/
    portal-pacientes-bupa.json     ← exportado desde Postman
  environments/
    local.json
    staging.json
  reportes/                        ← agregar a .gitignore
  datos/
    credenciales-validas.json      ← agregar a .gitignore
```

### Importar coleccion

1. Click en **Import** (boton en la barra lateral)
2. Arrastrar el archivo `.json` o seleccionarlo

### .gitignore — no commitear

```
postman/reportes/
postman/datos/credenciales-validas.json
postman/datos/credenciales-invalidas.json
```

---

## 12. Buenas Practicas

| Regla | Correcto | Incorrecto |
|---|---|---|
| Nombrar requests | `TC-001 \| POST Login retorna token` | `Login test` |
| Variables | `{{base_url}}/posts` | URL hardcodeada en cada request |
| Credenciales | Variables de environment (gitignored) | Hardcodeadas en el request |
| Un test por criterio | `pm.test('Status 200', ...)` separado | Multiples asserts en un pm.test |
| Flujos encadenados | Variables de coleccion para pasar datos | Copiar y pegar IDs entre requests |
| Versionado | Exportar coleccion a Git regularmente | Solo en Postman local |
| Ambientes | Environment por cada ambiente (local/staging/prod) | Cambiar URLs manualmente |
| Tiempo de respuesta | Siempre incluir test de tiempo | Ignorar performance |

**Nunca:**
- Hardcodear credenciales en el body del request
- Compartir colecciones con tokens activos
- Depender del orden de requests sin flujo encadenado explicito

---

## 13. Comandos de Terminal (Newman)

```bash
# Instalacion
npm install --save-dev newman
npm install --save-dev newman-reporter-htmlextra

# Correr coleccion completa
npx newman run postman/colecciones/coleccion.json

# Con environment
npx newman run coleccion.json --environment postman/environments/staging.json

# Solo una carpeta (equivalente a --spec en Cypress)
npx newman run coleccion.json --folder "REQ-001 — Carga del Portal"

# Con data file CSV
npx newman run coleccion.json --iteration-data postman/datos/datos.csv

# Con N iteraciones
npx newman run coleccion.json --iteration-count 3

# Reporte HTML
npx newman run coleccion.json --reporters cli,htmlextra \
  --reporter-htmlextra-export postman/reportes/reporte.html

# Sin fallar en errores de red (util en CI)
npx newman run coleccion.json --ignore-redirects

# Timeout por request (ms)
npx newman run coleccion.json --timeout-request 5000

# Ver scripts NPM definidos
npm run api:test
npm run api:smoke
npm run api:report
```

---

## 14. JSONPlaceholder — API de Practica

URL base: `https://jsonplaceholder.typicode.com`
Sin autenticacion. Simula respuestas reales pero no persiste datos.

### Endpoints disponibles

| Recurso | Endpoint | Metodos |
|---|---|---|
| Posts | `/posts` | GET, POST |
| Post por ID | `/posts/{id}` | GET, PUT, PATCH, DELETE |
| Comentarios | `/comments` | GET, POST |
| Usuarios | `/users` | GET, POST |
| Usuario por ID | `/users/{id}` | GET, PUT, PATCH, DELETE |
| Tareas | `/todos` | GET, POST |
| Fotos | `/photos` | GET |
| Albums | `/albums` | GET |

### Filtros por query param

```
GET /posts?userId=1           ← posts del usuario 1
GET /comments?postId=1        ← comentarios del post 1
GET /todos?completed=false    ← tareas pendientes
```

### Ejercicios practicos sugeridos

**Ejercicio 1 — GET basico:**
```
GET https://jsonplaceholder.typicode.com/posts/1

Tests:
- Status 200
- Body tiene: id, title, body, userId
- id es igual a 1
- Tiempo < 500ms
```

**Ejercicio 2 — POST:**
```
POST https://jsonplaceholder.typicode.com/posts
Body: { "title": "Mi post", "body": "Contenido", "userId": 1 }

Tests:
- Status 201
- Body tiene id generado
- title es igual al enviado
```

**Ejercicio 3 — Flujo encadenado:**
```
Request 1: POST /posts → guarda {{post_id}}
Request 2: GET /posts/{{post_id}} → verifica que existe
Request 3: DELETE /posts/{{post_id}} → verifica 200
```

**Ejercicio 4 — Datos invalidos:**
```
GET https://jsonplaceholder.typicode.com/posts/9999

Tests:
- Status 404
- Body es objeto vacio {}
```

---

## 15. APIs de Practica — Sandbox sin Backend Propio

Tres opciones para practicar sin depender de un backend real.

### Comparativa rapida

| | **JSONPlaceholder** | **httpbin.org** | **Postman Echo** |
|--|:--:|:--:|:--:|
| URL | `jsonplaceholder.typicode.com` | `httpbin.org` | `postman-echo.com` |
| Simula CRUD real | Si | No | No |
| Inspeccionar headers | No | Si | Si |
| Inspeccionar auth | No | Si | Si |
| Simular status codes | No | Si | No |
| Simular delays | No | Si | No |
| Requiere Postman | No | No | No (pero viene incluida) |
| Requiere login | No | No | No |

**Regla de uso:**
- Practicar GET/POST/PUT/DELETE con datos reales → **JSONPlaceholder**
- Practicar headers, auth, status codes, timeouts → **httpbin.org**
- Inspeccionar exactamente que envio en mi request → **Postman Echo**

---

### httpbin.org — Endpoints utiles para QA

URL base: `https://httpbin.org`

| Endpoint | Metodo | Que hace | Caso de uso QA |
|----------|--------|----------|---------------|
| `/get` | GET | Devuelve headers y params enviados | Verificar que el request llego bien formado |
| `/post` | POST | Devuelve el body enviado | Verificar que el JSON se construye correcto |
| `/put` | PUT | Devuelve el body enviado | Practicar PUT |
| `/patch` | PATCH | Devuelve el body enviado | Practicar PATCH |
| `/delete` | DELETE | Confirma el DELETE | Practicar DELETE |
| `/status/200` | GET | Responde con el status indicado | Simular cualquier status code (200, 401, 404, 500) |
| `/status/401` | GET | Responde 401 | Probar manejo de error de autenticacion |
| `/status/500` | GET | Responde 500 | Probar manejo de error de servidor |
| `/bearer` | GET | Valida header `Authorization: Bearer` | Practicar envio de tokens |
| `/headers` | GET | Devuelve todos los headers recibidos | Verificar headers de seguridad |
| `/delay/3` | GET | Responde despues de 3 segundos | Probar assertion de tiempo de respuesta |
| `/ip` | GET | Devuelve la IP publica | Util en pruebas de red |
| `/anything` | ANY | Devuelve todo lo recibido | Debug de cualquier request |

### Ejercicios practicos con httpbin.org

**Ejercicio 1 — Verificar que el body llega correcto:**
```
POST https://httpbin.org/post
Body: { "rut": "12.345.678-9", "password": "Pass123!" }

Tests:
- Status 200
- body.json.rut === "12.345.678-9"
- body.json.password existe
```
```javascript
pm.test('Status 200', () => pm.response.to.have.status(200))

const body = pm.response.json()
pm.test('RUT llego correcto', () => {
  pm.expect(body.json.rut).to.eql('12.345.678-9')
})
pm.test('Password presente en body', () => {
  pm.expect(body.json).to.have.property('password')
})
```

**Ejercicio 2 — Simular error 401 y validarlo:**
```
GET https://httpbin.org/status/401

Tests:
- Status 401
- Tiempo de respuesta < 500ms
```
```javascript
pm.test('TC-001 | Respuesta 401 simulada', () => pm.response.to.have.status(401))
pm.test('TC-002 | Tiempo < 500ms', () => pm.expect(pm.response.responseTime).to.be.below(500))
```

**Ejercicio 3 — Verificar envio de token Bearer:**
```
GET https://httpbin.org/bearer
Headers: Authorization: Bearer mi-token-de-prueba

Tests:
- Status 200
- body.authenticated === true
- body.token === "mi-token-de-prueba"
```
```javascript
pm.test('Token Bearer reconocido', () => pm.response.to.have.status(200))

const body = pm.response.json()
pm.test('Autenticado correctamente', () => pm.expect(body.authenticated).to.be.true)
pm.test('Token coincide', () => pm.expect(body.token).to.eql('mi-token-de-prueba'))
```

**Ejercicio 4 — Probar timeout (criterio B del REQ-001):**
```
GET https://httpbin.org/delay/4

Tests:
- Tiempo de respuesta >= 4000ms (debe fallar el criterio B)
```
```javascript
pm.test('TC-001 | Tiempo de carga < 3000ms', () => {
  pm.expect(pm.response.responseTime).to.be.below(3000)
  // Este test FALLA — sirve para practicar como se ve un fallo de tiempo
})
```

---

### Postman Echo — Endpoints utiles para QA

URL base: `https://postman-echo.com`
Viene como coleccion incluida en Postman. Carpetas disponibles:

| Carpeta | Que practica |
|---------|-------------|
| **Request Methods** | GET, POST, PUT, PATCH, DELETE — ver como llegan al servidor |
| **Headers** | Enviar y verificar headers personalizados |
| **Authentication Methods** | Basic Auth, Bearer Token, API Key, OAuth |
| **Cookie Manipulation** | Leer y enviar cookies |
| **Utilities** | Status codes, redirects |
| **Utilities / Date and Time** | Timestamps en responses |
| **Auth: Digest** | Autenticacion Digest avanzada |

**Ejercicio con Postman Echo — Inspeccionar headers enviados:**
```
GET https://postman-echo.com/headers
Headers personalizados:
  X-QA-Test: valor-de-prueba
  Authorization: Bearer mi-token

Tests:
- Status 200
- headers['x-qa-test'] existe en la respuesta
```
```javascript
pm.test('Status 200', () => pm.response.to.have.status(200))

const body = pm.response.json()
pm.test('Header personalizado recibido', () => {
  pm.expect(body.headers).to.have.property('x-qa-test')
  pm.expect(body.headers['x-qa-test']).to.eql('valor-de-prueba')
})
```

---

## 17. Snippets — Referencia Completa

Los snippets son fragmentos de código predefinidos disponibles en el panel derecho del editor de Scripts. Se insertan con un click y se adaptan al caso específico.

---

### Pre-request — Workflows

```javascript
// Send an HTTP request
// Hace una llamada HTTP antes de enviar el request principal
// Uso típico: obtener un token de autenticación
pm.sendRequest('https://httpbin.org/get', (error, response) => {
  if (error) { console.log(error) }
  console.log(response.json())
})

// Send an HTTP request from a Collection
// Igual que el anterior pero reutiliza un request ya guardado en la colección
const requestInCollection = {
  url: pm.environment.get('base_url') + '/api/auth/login',
  method: 'POST',
  header: { 'Content-Type': 'application/json' },
  body: { mode: 'raw', raw: JSON.stringify({ user: 'test', pass: '1234' }) }
}
pm.sendRequest(requestInCollection, (error, response) => {
  pm.environment.set('token', response.json().access_token)
})
```

---

### Pre-request — Variables

```javascript
// Get a global variable
const valor = pm.globals.get('nombre_variable')

// Get a collection variable
const valor = pm.collectionVariables.get('nombre_variable')

// Get an environment variable
const valor = pm.environment.get('nombre_variable')

// Get a variable (busca en todos los ámbitos por precedencia)
const valor = pm.variables.get('nombre_variable')

// Set a global variable
pm.globals.set('nombre_variable', 'valor')

// Set a collection variable
pm.collectionVariables.set('nombre_variable', 'valor')

// Set an environment variable
pm.environment.set('nombre_variable', 'valor')

// Set a variable (local — solo vive durante esta ejecución)
pm.variables.set('nombre_variable', 'valor')

// Clear a global variable
pm.globals.unset('nombre_variable')

// Clear a collection variable
pm.collectionVariables.unset('nombre_variable')

// Clear an environment variable
pm.environment.unset('nombre_variable')

// Clear a local variable
pm.variables.unset('nombre_variable')
```

---

### Post-response — Tests

```javascript
// Status code: Code is 200
pm.test('Status code is 200', () => {
  pm.response.to.have.status(200)
})

// Status code: Successful POST request
pm.test('Successful POST request', () => {
  pm.expect(pm.response.code).to.be.oneOf([201, 202])
})

// Status code: Code name has string
pm.test('Status code name has string', () => {
  pm.response.to.have.status('OK')
  // Otros valores: 'Created', 'Not Found', 'Unauthorized', 'Forbidden'
})

// Response body: Contains string
pm.test('Body contains string', () => {
  pm.expect(pm.response.text()).to.include('texto_esperado')
})

// Response body: Is equal to a string
pm.test('Body is correct string', () => {
  pm.expect(pm.response.text()).to.eql('texto_exacto')
})

// Response body: JSON value check
pm.test('JSON value check', () => {
  const body = pm.response.json()
  pm.expect(body.campo).to.eql('valor_esperado')
})

// Response body: Convert XML body to a JSON Object
pm.test('XML to JSON', () => {
  const body = xml2Json(pm.response.text())
  pm.expect(body).to.have.property('raiz')
})

// Response headers: Content-Type header check
pm.test('Content-Type is present', () => {
  pm.response.to.have.header('Content-Type')
})
// Verificar valor exacto:
pm.test('Content-Type is JSON', () => {
  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json')
})

// Response time is less than 200ms
pm.test('Response time is less than 200ms', () => {
  pm.expect(pm.response.responseTime).to.be.below(200)
})

// Use Tiny Validator for JSON data
const schema = {
  type: 'object',
  required: ['id', 'nombre'],
  properties: {
    id:     { type: 'number' },
    nombre: { type: 'string' }
  }
}
pm.test('Schema is valid', () => {
  pm.expect(tv4.validate(pm.response.json(), schema)).to.be.true
})
```

---

### Post-response — Workflows

```javascript
// Send an HTTP request (desde post-response)
// Uso típico: encadenar una segunda llamada con datos de la respuesta actual
const id = pm.response.json().id
pm.sendRequest(pm.environment.get('base_url') + '/api/recurso/' + id, (error, response) => {
  pm.test('Recurso creado es accesible', () => {
    pm.expect(response.code).to.eql(200)
  })
})

// Send an HTTP request from a Collection
// Reutiliza un request guardado — misma estructura que en pre-request
```

---

### Precedencia de ámbitos de variables

Cuando se usa `pm.variables.get()`, Postman busca en este orden (mayor a menor):

```
Local → Data → Environment → Collection → Global
```

Si la variable existe en varios ámbitos, se usa la del nivel más alto (Local primero).

---

## 18. Pre-request Scripts — Datos Dinamicos antes del Request

Los pre-request scripts se ejecutan **antes** de enviar el request. Sirven para generar datos dinámicos, calcular valores o preparar el entorno.

### Casos de uso comunes

| Caso | Código |
|------|--------|
| Timestamp Unix | `pm.environment.set('timestamp', Date.now())` |
| UUID aleatorio | `pm.environment.set('uuid', pm.variables.replaceIn('{{$guid}}'))` |
| Fecha ISO | `pm.environment.set('fecha_hoy', new Date().toISOString())` |
| Número aleatorio | `pm.environment.set('random_id', Math.floor(Math.random() * 1000))` |
| Token expirado simulado | `pm.environment.set('token_exp', 'eyJhbGciOiJIUzI1NiJ9.expired')` |

### Ejemplo — Request con timestamp dinámico

```javascript
// Pre-request Script
const now = new Date()
pm.environment.set('timestamp', now.toISOString())
pm.environment.set('epoch', now.getTime())
pm.environment.set('request_id', pm.variables.replaceIn('{{$guid}}'))
```

En el Body del request se usa como variable:
```json
{
  "request_id": "{{request_id}}",
  "timestamp": "{{timestamp}}",
  "data": "valor"
}
```

### Ejemplo — Generar RUT chileno de prueba

```javascript
// Pre-request Script — RUT ficticio para testing
const ruts = ['12345678-9', '98765432-1', '11111111-1']
const rut = ruts[Math.floor(Math.random() * ruts.length)]
pm.environment.set('rut_prueba', rut)
```

### Diferencia: Pre-request vs Tests

| | Pre-request Script | Tests |
|---|---|---|
| Cuándo corre | Antes del request | Después de recibir respuesta |
| Para qué | Preparar datos, setear variables | Validar respuesta, extraer datos |
| Tiene acceso a `pm.response` | No | Sí |

---

## 18. Schema Validation — Validar Estructura del JSON

Schema validation verifica que el JSON de respuesta tiene **exactamente** los campos y tipos esperados — no solo el status code.

### Por qué es importante en QA

Un endpoint puede retornar 200 con un body incorrecto. Schema validation captura eso. Es el equivalente a un contrato entre frontend y backend.

### Usando tv4 (disponible en Postman)

```javascript
const schema = {
  type: 'object',
  required: ['id', 'nombre', 'email'],
  properties: {
    id:     { type: 'number' },
    nombre: { type: 'string' },
    email:  { type: 'string' }
  },
  additionalProperties: false
}

pm.test('Schema es valido', () => {
  const body = pm.response.json()
  pm.expect(tv4.validate(body, schema)).to.be.true
})
```

### Schema para lista (array)

```javascript
const schemaLista = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'title'],
    properties: {
      id:    { type: 'number' },
      title: { type: 'string' }
    }
  },
  minItems: 1
}

pm.test('Respuesta es array con al menos 1 item', () => {
  pm.expect(tv4.validate(pm.response.json(), schemaLista)).to.be.true
})
```

### Campos opcionales con nullable

```javascript
const schema = {
  type: 'object',
  properties: {
    id:      { type: 'number' },
    nombre:  { type: 'string' },
    segundo_nombre: { type: ['string', 'null'] }  // puede ser null
  },
  required: ['id', 'nombre']
}
```

### Checklist de schema validation

- [ ] Tipo de dato correcto para cada campo (`string`, `number`, `boolean`, `array`, `object`, `null`)
- [ ] Campos requeridos presentes
- [ ] No hay campos inesperados (`additionalProperties: false`)
- [ ] Arrays tienen el mínimo de items esperado
- [ ] Campos de fecha en formato correcto (validar con regex si es necesario)

---

## 19. Data-Driven Testing — Un Test, Multiples Datasets

Data-driven testing ejecuta la misma colección varias veces con datos distintos. Útil para: múltiples usuarios, múltiples RUTs, múltiples escenarios de error.

### Estructura del archivo de datos

**CSV** (`datos-login.csv`):
```csv
usuario,password,status_esperado
usuario1@mail.com,pass123,200
usuario2@mail.com,pass456,200
invalido@mail.com,wrongpass,401
,sinpassword,400
```

**JSON** (`datos-login.json`):
```json
[
  { "usuario": "usuario1@mail.com", "password": "pass123", "status_esperado": 200 },
  { "usuario": "invalido@mail.com", "password": "wrongpass", "status_esperado": 401 }
]
```

### Request que usa las variables del dataset

Las columnas del CSV/JSON se convierten en variables de iteración `{{nombre_columna}}`:

```
POST {{base_url}}/api/auth/login
Body:
{
  "email": "{{usuario}}",
  "password": "{{password}}"
}
```

### Test que valida con el valor del dataset

```javascript
pm.test('Status correcto para el usuario', () => {
  const statusEsperado = parseInt(pm.iterationData.get('status_esperado'))
  pm.response.to.have.status(statusEsperado)
})

pm.test('Usuario registrado en respuesta', () => {
  if (pm.response.code === 200) {
    const body = pm.response.json()
    pm.expect(body).to.have.property('token')
  }
})
```

### Ejecutar con Newman desde terminal

```bash
# Con CSV
newman run coleccion.json \
  --environment entorno.json \
  --data datos-login.csv \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reporte.html

# Con JSON
newman run coleccion.json \
  --data datos-login.json
```

### Ejecutar con Collection Runner en Postman

1. Abrir colección → **Run collection**
2. Seleccionar archivo en **Select File**
3. Definir número de iteraciones (se auto-completa con el número de filas)
4. Click **Run**

### Cuándo usar data-driven vs casos individuales

| Escenario | Enfoque recomendado |
|-----------|---------------------|
| 2-3 variaciones | Casos individuales — más legibles |
| 4+ variaciones del mismo flujo | Data-driven con CSV/JSON |
| Combinaciones de campos | Data-driven — evita duplicación |
| Flujos distintos por tipo de usuario | Carpetas separadas en la colección |

---

## 20. OAuth 2.0 y Bearer Token — Flujo Completo

### Concepto

OAuth 2.0 es el estándar de autenticación en APIs modernas. El flujo básico:

```
1. Client → POST /auth/login  { user, password }
2. Server → { "access_token": "eyJ...", "expires_in": 3600 }
3. Client → GET /api/datos  Header: Authorization: Bearer eyJ...
4. Server → 200 { datos }
```

### Configuración automática en Postman

**En el request de login (Tests tab):**
```javascript
// Extrae el token y lo guarda en variable de entorno
const body = pm.response.json()
pm.environment.set('access_token', body.access_token)
pm.environment.set('token_type', body.token_type || 'Bearer')

// Validar que el token llegó
pm.test('Token recibido correctamente', () => {
  pm.expect(body).to.have.property('access_token')
  pm.expect(body.access_token).to.be.a('string').and.not.empty
})
```

**En todos los requests protegidos (Authorization tab):**
- Type: `Bearer Token`
- Token: `{{access_token}}`

O manualmente en el header:
```
Authorization: {{token_type}} {{access_token}}
```

### Validar expiración del token

```javascript
// Tests del request de login
const body = pm.response.json()
const tokenExp = body.expires_in  // segundos

pm.test('Token tiene tiempo de expiracion', () => {
  pm.expect(tokenExp).to.be.a('number').and.above(0)
})

// Calcular y guardar timestamp de expiracion
const expTimestamp = Date.now() + (tokenExp * 1000)
pm.environment.set('token_expira_en', expTimestamp)
```

### Pre-request Script — Renovar token si está expirado

```javascript
// Pre-request Script del request protegido
const tokenExpira = pm.environment.get('token_expira_en')
const ahora = Date.now()

if (!tokenExpira || ahora >= parseInt(tokenExpira)) {
  // Token expirado o no existe — solicitar nuevo
  pm.sendRequest({
    url: pm.environment.get('base_url') + '/api/auth/refresh',
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: {
      mode: 'raw',
      raw: JSON.stringify({ refresh_token: pm.environment.get('refresh_token') })
    }
  }, (err, res) => {
    if (!err && res.code === 200) {
      const nuevoToken = res.json().access_token
      pm.environment.set('access_token', nuevoToken)
      pm.environment.set('token_expira_en', Date.now() + (3600 * 1000))
    }
  })
}
```

### Tipos de autenticación en Postman

| Tipo | Cuándo usar | Header generado |
|------|-------------|-----------------|
| No Auth | Endpoints públicos | — |
| Basic Auth | Usuario + contraseña en base64 | `Authorization: Basic dXNlcjpwYXNz` |
| Bearer Token | JWT, OAuth access token | `Authorization: Bearer eyJ...` |
| API Key | APIs con clave fija | `X-API-Key: abc123` o en query param |
| OAuth 2.0 | Flujo OAuth completo con refresh | Gestionado por Postman |

---

## 21. Mock Servers — Simular la API sin Backend

Un mock server devuelve respuestas predefinidas sin necesidad de que el backend exista. Útil cuando: el backend está en desarrollo, el endpoint es inestable, o se necesita aislar el frontend.

### Crear un Mock Server en Postman

1. En la colección → **...** → **Mock Collection**
2. Definir nombre del mock
3. Postman genera una URL única: `https://xxxxx.mock.pstmn.io`
4. Configurar `base_url` del entorno a esa URL

### Cómo funcionan los ejemplos (Examples)

Cada request puede tener uno o más **examples** — Postman los usa para responder el mock:

```
Request: GET /api/usuarios/1
Example: "Usuario encontrado"
  → Status: 200
  → Body: { "id": 1, "nombre": "Juan", "email": "juan@mail.com" }

Example: "Usuario no encontrado"
  → Status: 404
  → Body: { "error": "Usuario no existe" }
```

El mock responde con el example que coincide por método + path + (opcionalmente) query params o headers.

### Agregar un example en Postman

1. Abrir el request
2. Click **Save** → **Save as Example**
3. Editar el status code y body de la respuesta mock
4. El mock server ya responde con ese body

### Cuándo usar mock vs API real

| Situación | Mock | API Real |
|-----------|:----:|:--------:|
| Backend en desarrollo | Si | No |
| Tests de contrato | Si | No |
| Tests de integración completa | No | Si |
| Demo para stakeholders | Si | Depende |
| Pipeline CI/CD | Depende | Si (preferible) |

### Limitaciones del Mock Server de Postman

- No ejecuta lógica — solo devuelve el body predefinido
- No persiste datos entre requests
- Requiere cuenta Postman (gratuita tiene límite de calls por mes)
- No reemplaza pruebas de integración reales

---

## 22. Newman en GitHub Actions — CI/CD

### Archivo de workflow básico

`.github/workflows/api-tests.yml`:

```yaml
name: API Tests — Newman

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  api-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Instalar Newman y reporter
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra

      - name: Ejecutar colección API
        run: |
          newman run postman/colecciones/mi-api.json \
            --environment postman/environments/staging.json \
            --reporters cli,htmlextra \
            --reporter-htmlextra-export reports/api-report.html \
            --bail

      - name: Subir reporte HTML
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: api-test-report
          path: reports/api-report.html
```

### Flag `--bail`

Con `--bail`, Newman detiene la ejecución en el primer test fallido. Sin `--bail`, corre todos y reporta al final. Para CI/CD se recomienda `--bail` en smoke tests, sin `--bail` en regression.

### Variables de entorno como GitHub Secrets

En el workflow, inyectar credenciales como secrets:

```yaml
      - name: Ejecutar colección con secrets
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
          BASE_URL:  ${{ secrets.STAGING_URL }}
        run: |
          newman run coleccion.json \
            --env-var "base_url=$BASE_URL" \
            --env-var "token=$API_TOKEN"
```

**Nunca hardcodear tokens en el archivo de colección ni en el entorno exportado.**

### Estructura recomendada de archivos en el repo

```
postman/
├── colecciones/
│   └── nombre-api.json          ← exportar desde Postman
├── environments/
│   ├── staging.json             ← sin credenciales
│   └── local.json               ← sin credenciales
└── data/
    └── datasets-prueba.csv      ← datos de prueba genéricos
```

### Exit codes de Newman

| Código | Significado |
|--------|-------------|
| 0 | Todos los tests pasaron |
| 1 | Hubo al menos un test fallido |
| 2 | Error de Newman (colección inválida, archivo no encontrado) |

GitHub Actions interpreta exit code != 0 como step fallido → el pipeline falla.

---

## 23. Reportes HTML y JSON — Evidencia de Ejecución

### Newman Reporter HTMLextra

El reporter más completo para Postman/Newman. Genera un HTML con:
- Dashboard con resumen de pasados/fallidos
- Detalle de cada request y response
- Tiempo de respuesta por request
- Gráficos de resultados

### Instalación

```bash
npm install -g newman-reporter-htmlextra
```

### Comando con reporte HTML

```bash
newman run coleccion.json \
  --environment entorno.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reporte-api.html \
  --reporter-htmlextra-title "API Tests — Portal Pacientes" \
  --reporter-htmlextra-browserTitle "Reporte QA" \
  --reporter-htmlextra-showOnlyFails
```

### Opciones del reporter HTMLextra

| Flag | Efecto |
|------|--------|
| `--reporter-htmlextra-export <path>` | Ruta del archivo HTML generado |
| `--reporter-htmlextra-title "..."` | Título del reporte |
| `--reporter-htmlextra-showOnlyFails` | Solo muestra tests fallidos |
| `--reporter-htmlextra-omitRequestBodies` | Oculta bodies de requests (para datos sensibles) |
| `--reporter-htmlextra-omitResponseBodies` | Oculta bodies de responses |

### Reporte JSON — para integración con otras herramientas

```bash
newman run coleccion.json \
  --reporters json \
  --reporter-json-export resultado.json
```

El JSON contiene toda la ejecución — puede procesarse con scripts para publicar resultados en Jira, Slack, o dashboards.

### Reporte JUnit — para GitHub Actions y Azure DevOps

```bash
npm install -g newman-reporter-junitfull

newman run coleccion.json \
  --reporters junitfull \
  --reporter-junitfull-export resultado.xml
```

Azure DevOps y GitHub Actions pueden consumir XML JUnit nativamente para mostrar resultados de tests en la UI del pipeline.

### Múltiples reporters simultáneos

```bash
newman run coleccion.json \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export reports/reporte.html \
  --reporter-json-export reports/resultado.json
```

---

## 24. Patrones de Error Frecuentes — Troubleshooting

### Tabla de errores comunes

| Error | Causa probable | Qué revisar |
|-------|---------------|-------------|
| `401 Unauthorized` | Token inválido, expirado o ausente | Authorization header, formato `Bearer <token>`, expiración |
| `403 Forbidden` | Token válido pero sin permisos | Rol del usuario, scope del token, endpoint correcto |
| `404 Not Found` | URL incorrecta, recurso no existe | `{{base_url}}` tiene valor, path correcto, ID existe |
| `400 Bad Request` | Body malformado, campo requerido faltante | Content-Type `application/json`, campos obligatorios, tipos de dato |
| `500 Internal Server Error` | Bug en el backend | Revisar logs del servidor, reportar al Dev Team |
| `CORS error` | Postman no falla por CORS — solo el browser | Si aparece en Postman App, verificar que no sea la extensión de Chrome |
| `SSL Error` | Certificado inválido o autofirmado | Desactivar SSL verification en Settings (solo para entornos de prueba) |
| `ECONNREFUSED` | Servidor caído o URL incorrecta | Verificar que el servidor corre, `base_url` correcto, puerto correcto |
| `Timeout` | Servidor lento o request cuelga | Aumentar timeout en Settings, verificar endpoint |

### Checklist cuando un test falla inesperadamente

```
[ ] ¿El entorno seleccionado es el correcto? (local, staging, prod)
[ ] ¿Las variables de entorno tienen valor? (verificar en "Environment Quick Look")
[ ] ¿El token está vigente? (login de nuevo si es necesario)
[ ] ¿El body tiene Content-Type: application/json?
[ ] ¿El JSON del body tiene sintaxis válida? (sin comas finales, comillas correctas)
[ ] ¿El endpoint existe en ese ambiente? (puede no estar desplegado en staging)
[ ] ¿La colección exportada está actualizada? (re-exportar desde Postman si hay dudas)
```

### Depurar con la consola de Postman

En Postman App: **View → Show Postman Console** (Ctrl+Alt+C)

Muestra el request real enviado, headers, body y response completo. Útil para verificar qué se envió exactamente.

```javascript
// En Tests o Pre-request Script — imprimir valores para debug
console.log('Token actual:', pm.environment.get('access_token'))
console.log('Base URL:', pm.environment.get('base_url'))
console.log('Response body:', pm.response.json())
```

### Errores de assertions comunes y cómo corregirlos

```javascript
// Error: AssertionError: expected 'texto' to equal 'Texto'
// Causa: comparación case-sensitive
// Solución:
pm.expect(body.campo.toLowerCase()).to.eql('texto')

// Error: TypeError: Cannot read property 'id' of undefined
// Causa: body.data no existe o es null
// Solución: verificar estructura antes de acceder
pm.test('Data tiene id', () => {
  pm.expect(pm.response.json()).to.have.nested.property('data.id')
})

// Error: expected { id: '1' } to have property 'id' of type number
// Causa: el backend devuelve string en lugar de number
// Solución: ajustar schema o parsear con parseInt()
pm.expect(parseInt(body.id)).to.be.a('number')
```

---

## 25. Conocimiento Especifico — Portal Pacientes BUPA


| Dato | Detalle |
|---|---|
| **URL base** | `https://portalpaciente.bupa.cl` |
| **Stack backend** | Go (inferido del descriptor de cargo) |
| **Autenticacion** | JWT — token obtenido del endpoint de login |
| **Endpoint login** | `POST /api/auth/login` (por confirmar con equipo BUPA) |
| **Health check** | `GET /api/health` (mencionado en REQ-001-SDD seccion 6) |
| **Credenciales** | En `cypress/fixtures/auth/credenciales-validas.json` (gitignored) |
| **Coleccion** | `postman/colecciones/portal-pacientes-bupa.json` |

### Tests de REQ-001 aplicables en Postman

```javascript
// TC-001 | Portal responde 200
pm.test('TC-001 | Portal responde 200', () => pm.response.to.have.status(200))

// TC-002 | Tiempo de respuesta del servidor < 7000ms
pm.test('TC-002 | Servidor responde en menos de 7 segundos', () => {
  pm.expect(pm.response.responseTime).to.be.below(7000)
})

// TC-003 | Header Content-Type presente
pm.test('TC-003 | Content-Type presente en respuesta', () => {
  pm.response.to.have.header('Content-Type')
})
```

### Estructura de coleccion BUPA

```
Portal Pacientes BUPA
├── 📁 REQ-001 — Carga del Portal
├── 📁 REQ-003 — Login Exitoso
├── 📁 REQ-004 — Credenciales Invalidas
├── 📁 REQ-005 — RUT Formato Incorrecto
└── 📁 Smoke Tests (subset critico para CI/CD)
```

---

## 26. Variables Dinamicas — Datos Unicos sin Scripts

Las variables dinámicas generan valores aleatorios o únicos en tiempo de ejecución. Se usan directamente en el body o la URL con la sintaxis `{{$variable}}` — sin escribir ningún script.

### Variables disponibles

| Variable | Qué genera | Ejemplo de salida |
|---|---|---|
| `{{$guid}}` | UUID único | `a4f3c2d1-8e9b-4f7a-b3c2-1d2e3f4a5b6c` |
| `{{$timestamp}}` | Timestamp Unix (segundos) | `1717516800` |
| `{{$isoTimestamp}}` | Fecha ISO 8601 | `2026-06-04T12:00:00.000Z` |
| `{{$randomInt}}` | Número entero 0–1000 | `742` |
| `{{$randomFirstName}}` | Nombre aleatorio | `Carlos` |
| `{{$randomLastName}}` | Apellido aleatorio | `González` |
| `{{$randomEmail}}` | Email aleatorio | `user123@mail.com` |
| `{{$randomPhoneNumber}}` | Teléfono aleatorio | `+1-555-0132` |
| `{{$randomBoolean}}` | true o false | `true` |
| `{{$randomAlphaNumeric}}` | Caracter alfanumérico | `x` |
| `{{$randomUUID}}` | UUID v4 | igual que `$guid` |

### Cuándo usarlas

| Caso | Variable recomendada |
|---|---|
| Crear usuario con email único por ejecución | `{{$randomEmail}}` |
| Generar ID de correlación para trazabilidad | `{{$guid}}` |
| Timestamp de creación en el body | `{{$isoTimestamp}}` |
| Cantidad o número de página aleatorio | `{{$randomInt}}` |

### Ejemplo — POST con datos únicos sin script

```
POST {{base_url}}/api/usuarios
Body (raw → JSON):
{
  "nombre": "{{$randomFirstName}}",
  "apellido": "{{$randomLastName}}",
  "email": "{{$randomEmail}}",
  "request_id": "{{$guid}}",
  "timestamp": "{{$isoTimestamp}}"
}
```

Cada ejecución genera un usuario diferente — sin tocar el body.

### Variables dinámicas vs Pre-request Script

| | Variable dinámica `{{$x}}` | Pre-request Script |
|---|---|---|
| Código requerido | No | Sí |
| Guardar valor para usarlo después | No | Sí — con `pm.environment.set()` |
| Lógica condicional | No | Sí |
| Casos de uso | Datos únicos simples | Lógica compleja, tokens, RUTs específicos |

---

## 27. Body Types — form-data, raw y text

Al hacer un POST, PUT o PATCH, Postman ofrece varios formatos para el body. Elegir el incorrecto es causa frecuente de errores 400.

### Tipos de body disponibles

| Tipo | Cuándo usarlo | Content-Type generado |
|---|---|---|
| **none** | Requests sin body (GET, HEAD, DELETE) | — |
| **form-data** | Formularios HTML, subida de archivos | `multipart/form-data` |
| **x-www-form-urlencoded** | Formularios simples sin archivos | `application/x-www-form-urlencoded` |
| **raw → JSON** | APIs REST modernas — el más común en QA | `application/json` |
| **raw → Text** | Enviar texto plano | `text/plain` |
| **raw → XML** | APIs SOAP o legacy | `application/xml` |
| **binary** | Subir archivos binarios (imágenes, PDFs) | `application/octet-stream` |
| **GraphQL** | APIs GraphQL | `application/json` |

### raw → JSON (el más usado en QA)

```
POST {{base_url}}/api/auth/login
Body: raw → JSON

{
  "email": "usuario@bupa.cl",
  "password": "Pass123!"
}
```

Postman agrega automáticamente `Content-Type: application/json`.

### form-data (formularios y archivos)

Se usa cuando el endpoint espera `multipart/form-data` — común en subida de documentos o formularios web:

```
POST {{base_url}}/api/documentos/upload
Body: form-data

Key         | Type | Value
------------|------|------------------
archivo     | File | documento.pdf
tipo        | Text | certificado_medico
paciente_id | Text | 12345
```

### x-www-form-urlencoded (formularios simples)

```
POST {{base_url}}/api/auth/login
Body: x-www-form-urlencoded

Key      | Value
---------|------------------
username | usuario@bupa.cl
password | Pass123!
```

El servidor recibe los datos como `username=usuario%40bupa.cl&password=Pass123%21`.

### Cómo identificar qué tipo usar

```
1. ¿El endpoint recibe JSON?         → raw → JSON
2. ¿El endpoint sube archivos?        → form-data
3. ¿Es un formulario HTML clásico?    → x-www-form-urlencoded
4. ¿La documentación dice multipart?  → form-data
```

### Error frecuente

```
Enviaste: raw → JSON  { "email": "x", "password": "y" }
El servidor esperaba: form-data

Resultado: 400 Bad Request o campos null en el servidor
Solución: cambiar el tipo de body en Postman para que coincida con lo que espera el endpoint
```

---

## 28. Newman con Postman API — Ejecutar sin Exportar JSON

En lugar de exportar la colección como archivo JSON, se puede ejecutar directamente desde la nube de Postman usando la API de Postman. Útil cuando las colecciones se actualizan frecuentemente o se trabaja en equipo.

### Requisitos

1. Cuenta Postman (gratuita)
2. API Key de Postman
3. UID de la colección y del environment

### Paso 1 — Generar API Key

1. En Postman → click en el avatar (esquina superior derecha)
2. **Settings → API Keys → Generate API Key**
3. Copiar la key — se muestra una sola vez

### Paso 2 — Obtener el UID de la colección

```bash
curl https://api.getpostman.com/collections?apikey=TU_API_KEY
```

Respuesta:
```json
{
  "collections": [
    { "id": "abc123", "uid": "55117362-abc123", "name": "REQ-001 BUPA" }
  ]
}
```

### Paso 3 — Obtener el UID del environment

```bash
curl https://api.getpostman.com/environments?apikey=TU_API_KEY
```

### Paso 4 — Ejecutar Newman con la URL remota

```bash
newman run "https://api.getpostman.com/collections/$UID_COLECCION?apikey=$API_KEY" \
  --environment "https://api.getpostman.com/environments/$UID_ENV?apikey=$API_KEY" \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export postman/reportes/reporte.html
```

### En PowerShell

```powershell
$apiKey    = "TU_API_KEY"
$uidCol    = "55117362-abc123"
$uidEnv    = "55117362-env456"

npx newman run "https://api.getpostman.com/collections/${uidCol}?apikey=${apiKey}" `
  --environment "https://api.getpostman.com/environments/${uidEnv}?apikey=${apiKey}" `
  --reporters cli,json `
  --reporter-json-export postman/reportes/REQ-001-results.json
```

### Ventajas vs exportar JSON

| | Archivo JSON exportado | Postman API (UID remoto) |
|---|---|---|
| Actualización | Manual — re-exportar cada vez | Automática — siempre usa la versión más reciente |
| Versionado | En Git | En la nube de Postman |
| Funciona sin internet | Si | No |
| Ideal para | Proyectos locales, sin cuenta | Equipos que comparten colecciones |

### Seguridad — nunca hardcodear la API Key

Guardarla como GitHub Secret o variable de entorno:

```yaml
# GitHub Actions
- name: Ejecutar Newman via Postman API
  env:
    POSTMAN_API_KEY: ${{ secrets.POSTMAN_API_KEY }}
  run: |
    newman run "https://api.getpostman.com/collections/$UID?apikey=$POSTMAN_API_KEY"
```
