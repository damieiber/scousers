# FanNews - Guía de Demostración y Documentación

Esta guía presenta **FanNews**, el hub de noticias deportivas potenciado por IA.  
**Versión**: MVP 1.0 (Enero 2026)  
**Enfoque**: Liverpool / Everton

---

## 🚀 ¿Qué es FanNews?

**FanNews** es un "Hub Inteligente" diseñado para fanáticos que sufren de sobrecarga informativa. En lugar de visitar múltiples sitios, FanNews utiliza **Inteligencia Artificial** para:

1.  **Leer por ti:** Recopila noticias de medios partidarios y mainstream.
2.  **Entender:** Agrupa noticias sobre el mismo tema para eliminar duplicados.
3.  **Resumir:** Genera un párrafo conciso con lo más importante.
4.  **Personalizar:** Adapta el contenido a tus preferencias.

> **Valor Diferencial:** Ahorro de tiempo y reducción de ruido a través de curaduría automática.

---

## 🛠️ Tecnología (Resumen Técnico)

*   **Frontend**: [Next.js 15](https://nextjs.org) (App Router) + Tailwind CSS + shadcn/ui.
*   **Backend**: [Supabase](https://supabase.com) (PostgreSQL + Auth + pgvector).
*   **Inteligencia Artificial**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/) para procesamiento, resumen y embeddings semánticos.
*   **Infraestructura**: Despliegue en Vercel con Cron Jobs para ingesta automatizada.

---

## 🎮 Guía de Prueba (Paso a Paso)

Sigue estos pasos para experimentar el flujo completo de usuario:

### 1. Experiencia Inicial (Visitante)
*   **Acción**: Ingresa a la Home Page.
*   **Qué observar**:
    *   **Feed Inteligente**: Tarjetas de noticias con "Resumen IA" y fuente original.
    *   **Efemérides**: Panel lateral o integrado con hechos históricos del día.
    *   *Nota*: Sin login, las funciones avanzadas están ocultas.

### 2. Autenticación Sencilla
*   **Acción**: Haz clic en "Ingresar" (arriba a la derecha).
*   **Prueba**:
    *   Usa **"Continuar con Google"** para un acceso instantáneo.
    *   O regístrate con email (requiere confirmación).
*   **Resultado**: Tu avatar aparece en el header. Ahora tienes perfil.

### 3. Perfil y Suscripción
*   **Acción**: Clic en tu Avatar -> "Perfil".
*   **Qué observar**:
    *   Tu Plan actual (Free, Trial o Premium).
    *   Las "Features" activas (ej. Acceso a Modo Rival, Multi-equipo).

### 4. Prueba del "Modo Rival" ⚔️ (Feature Premium)
*   **Contexto**: Permite espiar la actualidad del clásico rival (Boca Juniors) con un filtro de sentimiento.
*   **Requiere**: Usuario con suscripción Premium o Trial activo.
*   **Acción**: En el Header, activa el botón **"RIVAL"** (icono de espadas).
*   **Resultado**:
    *   La interfaz cambia de tono (rojo intenso).
    *   El feed muestra noticias filtradas semánticamente sobre el rival.

### 5. Navegación
*   **Feed**: Scroll infinito de noticias agrupadas.
*   **Efemérides**: Explora la historia del club día por día.

---

## 🧪 Notas para Desarrolladores

### Ingesta Manual
Para disparar el pipeline de IA manualmente (si el feed está vacío):

```bash
npm run ingest:sources
```

### Stack de Datos
*   **`themed_articles`**: Noticias procesadas y deduplicadas.
*   **`sources`**: URLs de origen y selectores de scraping.
*   **`user_profiles`**: Gestión de tiers y permisos.
