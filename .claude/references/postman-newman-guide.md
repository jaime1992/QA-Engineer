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

> **Idempotente:** llamar al endpoint una o diez veces produce el mismo estado final. GET, PUT, PATCH y DELETE lo son. POST no.

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

## 15. Conocimiento Especifico — Portal Pacientes BUPA

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
