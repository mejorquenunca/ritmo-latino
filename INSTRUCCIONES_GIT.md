# Cómo Crear un Repositorio de Git para tu Proyecto "Ritmo Latino"

Esta guía te mostrará cómo inicializar un repositorio de Git para tu proyecto, realizar tu primer "commit" y conectarlo a un repositorio remoto como GitHub.

Sigue estos pasos desde la terminal de tu ordenador.

### Prerrequisito: Tener Git Instalado

Asegúrate de tener Git instalado en tu sistema. Puedes verificarlo escribiendo este comando en tu terminal:

```bash
git --version
```

Si no está instalado, puedes descargarlo desde [git-scm.com](https://git-scm.com/).

---

### Paso 1: Navega a la Carpeta de tu Proyecto

Abre tu terminal. Verás algo como `C:\Users\ASUS>`. Ahora, usa el comando `cd` (Change Directory) para situarte dentro de la carpeta raíz de tu proyecto.

**¡Muy Importante!** No entres en la carpeta `src`. Todos los comandos deben ejecutarse desde la carpeta principal del proyecto (la que contiene `package.json`).

```bash
# Reemplaza la ruta con la ubicación real de tu proyecto.
# El comando es "cd" seguido de la ruta.
cd C:\Users\ASUS\Desktop\mis-proyectos
```
*Después de ejecutar este comando, tu terminal debería mostrar algo como: `C:\Users\ASUS\Desktop\mis-proyectos>`*

---

### Paso 2: Inicializa el Repositorio de Git

Este comando crea un nuevo subdirectorio oculto llamado `.git` que contiene todos los archivos necesarios del repositorio.

```bash
git init
```

---

### Paso 3: Crea un archivo `.gitignore`

Este es un paso **muy importante**. El archivo `.gitignore` le dice a Git qué archivos o carpetas debe ignorar. Para un proyecto Next.js, es crucial ignorar la carpeta `node_modules`.

**¡Hecho!** Ya he creado este archivo por ti, así que puedes saltar al siguiente paso.

---

### Paso 4: Añade todos los Archivos al "Staging Area"

Este comando prepara todos los archivos de tu proyecto (excepto los que están en `.gitignore`) para ser guardados en el historial del repositorio.

```bash
git add .
```

---

### Paso 5: Realiza tu Primer "Commit"

Un "commit" es como una instantánea de tu proyecto en un momento determinado.

```bash
git commit -m "Initial commit: Proyecto Ritmo Latino"
```

---

### Paso 6: Conecta tu Repositorio Local a uno Remoto (Ej: GitHub)

1.  **Crea un Repositorio en GitHub:**
    *   Ve a [GitHub](https://github.com/).
    *   Haz clic en "New repository".
    *   Dale un nombre (por ejemplo, `ritmo-latino-app`).
    *   **Importante:** No inicialices el repositorio con un `README` o `.gitignore` desde GitHub. Déjalo vacío.
    *   Copia la URL del repositorio que te proporciona GitHub (será algo como `https://github.com/tu-usuario/ritmo-latino-app.git`).

2.  **Enlaza el Repositorio Remoto:**
    Vuelve a tu terminal y ejecuta el siguiente comando, reemplazando la URL de ejemplo con la tuya.

    ```bash
    git remote add origin https://github.com/tu-usuario/ritmo-latino-app.git
    ```

3.  **Sube tus Archivos a GitHub:**

    ```bash
    git push -u origin main
    ```

¡Y listo! Ahora tu proyecto está en Git y sincronizado con GitHub.
