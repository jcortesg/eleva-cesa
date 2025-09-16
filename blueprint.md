# Blueprint: Arquitectura del Proyecto

## Visión General

Este documento describe la arquitectura y el plan de desarrollo para la aplicación Next.js. El objetivo es construir una base sólida, escalable y mantenible siguiendo los principios de la Arquitectura Limpia.

## Arquitectura Adoptada

Se ha decidido implementar una arquitectura basada en capas para separar las responsabilidades del sistema:

- **Presentation (UI / Rutas):** Responsable de la interfaz de usuario y la interacción.
  - Ubicación: `src/app` para rutas, `src/components` para componentes reutilizables.
  - Orquesta las llamadas a la capa de aplicación.

- **Application (Casos de Uso):** Contiene la lógica de negocio y los flujos de la aplicación.
  - Ubicación: `src/application`.

- **Domain (Entidades/Tipos):** Define los modelos de negocio principales y las reglas universales.
  - Ubicación: `src/domain`.

- **Infrastructure:** Implementaciones concretas de servicios externos (bases de datos, APIs, etc.).
  - Ubicación: `src/infrastructure`.

## Rutas de la Aplicación

### Rutas de la Interfaz de Usuario (Frontend)

- **`GET /donations`**: Página que muestra el formulario de donación.
- **`GET /resultado`**: Página de agradecimiento y estado de la donación, a la que se redirige después del pago.

### Rutas de la API (Backend)

- **`POST /api/donations`**:
  - **Función:** Crea una nueva intención de donación.
  - **Proceso:**
    1. Recibe los datos del formulario de donación.
    2. Llama al servicio de eCollect para crear la transacción.
    3. Devuelve la URL de pago y la referencia de la transacción.
  - **Respuesta Exitosa (200):** `{ ok: true, paymentUrl, paymentId }`

- **`GET /api/donations/:reference`** (Opcional):
  - **Función:** Obtiene el estado de una donación específica.
  - **Respuesta:** `{ status, amount, destination, paymentId }`

- **`POST /api/webhooks/ecollect`**:
  - **Función:** Recibe notificaciones de estado de eCollect.
  - **Proceso:**
    1. Valida la autenticidad de la notificación.
    2. Actualiza el estado de la donación en la base de datos.
    3. Responde con un estado 200 para confirmar la recepción.

- **`GET /api/health`**:
  - **Función:** Endpoint de healthcheck para monitoreo.
  - **Respuesta:** `{ status: "ok" }`

## Plan Actual

1.  **Completado:** Definir y acordar la estructura arquitectónica del proyecto.
2.  **Completado:** Crear la estructura de directorios.
3.  **En progreso:** Crear la estructura de archivos para las rutas de la API y la interfaz de usuario.
4.  **Siguiente:** Implementar la lógica para cada una de las rutas.
