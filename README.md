# Ritmo Latino - Proyecto de Firebase Studio

¡Bienvenido al código fuente de tu aplicación Ritmo Latino!

Esta es una aplicación web construida con Next.js, React, TypeScript y Firebase.

---

## Cómo Ejecutar el Proyecto Localmente

Una vez que hayas descargado y descomprimido el archivo ZIP del proyecto, sigue estos pasos desde tu terminal:

### 1. Navega a la Carpeta del Proyecto

Abre una terminal. Verás algo como `C:\Users\ASUS>`. Ahora, usa el comando `cd` (Change Directory) para situarte en la carpeta raíz que descomprimiste.

**¡Muy Importante!** No entres en la carpeta `src`. Todos los comandos deben ejecutarse desde la carpeta principal del proyecto (la que contiene el archivo `package.json`).

```bash
# Ejemplo: si descomprimiste el proyecto en "C:\Users\ASUS\Desktop\mis-proyectos", usa ese comando.
# El comando es "cd" seguido de la ruta.
cd C:\Users\ASUS\Desktop\mis-proyectos
```
*Después de ejecutar este comando, tu terminal debería mostrar la nueva ruta, algo como: `C:\Users\ASUS\Desktop\mis-proyectos>`*

### 2. Instala las Dependencias

Este comando leerá el archivo `package.json` y descargará todas las librerías necesarias en una carpeta llamada `node_modules`.

```bash
npm install
```

### 3. Inicia el Servidor de Desarrollo

Esto arrancará la aplicación en tu máquina local.

```bash
npm run dev
```

### 4. Abre la Aplicación

Abre tu navegador y ve a la siguiente dirección:

[http://localhost:3000](http://localhost:3000)

¡Y listo! Ahora tienes la aplicación corriendo en tu propia computadora.

---

## Cómo Desplegar el Proyecto en Firebase Hosting

Tu proyecto está pre-configurado para un despliegue sencillo. Sigue estos pasos desde tu ordenador:

### Prerrequisitos:

*   **Node.js:** Asegúrate de tenerlo instalado ([nodejs.org](https://nodejs.org/)).
*   **Cuenta de Firebase:** Necesitas una cuenta de Firebase (puedes usar tu cuenta de Google).

### Pasos para el Despliegue:

1.  **Descarga y Descomprime:** Descarga el código fuente como un archivo ZIP desde Firebase Studio y descomprímelo en tu ordenador. No te preocupes por no poder descargar las carpetas `node_modules` o `chunks`; no son necesarias.

2.  **Instala Firebase CLI (si no lo tienes):**
    Abre tu terminal y ejecuta:
    ```bash
    npm install -g firebase-tools
    ```

3.  **Inicia Sesión en Firebase:**
    En tu terminal, ejecuta `firebase login`. Se abrirá un navegador para que inicies sesión.
    ```bash
    firebase login
    ```

4.  **Navega a la Carpeta Raíz del Proyecto:**
    Usa el comando `cd` para situarte dentro de la carpeta que descomprimiste. **No entres en la carpeta `src`**.

    ```bash
    # Ejemplo: si tu proyecto está en "C:\Users\ASUS\Desktop\mis-proyectos", esa es la carpeta correcta.
    # Recuerda usar "cd" antes de la ruta.
    cd C:\Users\ASUS\Desktop\mis-proyectos
    ```
    *Después, tu terminal debería mostrar: `C:\Users\ASUS\Desktop\mis-proyectos>`*

5.  **Instala Dependencias (si no lo hiciste antes):**
    Una vez en la carpeta correcta, ejecuta:
    ```bash
    npm install
    ```

6.  **Despliega tu Aplicación:**
    ¡Este es el paso final! Este comando construirá y subirá tu aplicación a Firebase Hosting.
    ```bash
    npm run deploy
    ```

Una vez que el comando termine, la terminal te mostrará la URL pública de tu aplicación (algo como `https://<tu-proyecto-id>.web.app`). ¡Y eso es todo! Tu aplicación estará en línea.

---
*Este es un proyecto NextJS iniciado en Firebase Studio.*
