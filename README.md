# AI-Powered Fan Hub - River Plate MVP

Una plataforma que resuelve la sobrecarga de información para los fanáticos del deporte, ofreciendo un feed de noticias hiper-personalizado con IA para agregar, resumir, curar y jerarquizar contenido.

## 🚀 Características del MVP

- ✅ **Feed de noticias** con resúmenes generados por IA (Gemini)
- ✅ **Agrupación semántica** de noticias similares
- ✅ **Engagement diario** con efemérides y foto del día
- ✅ **Experiencia River Plate** con diseño personalizado
- ✅ **Datos hardcodeados** para desarrollo rápido
- ✅ **IA integrada** con Gemini para contenido dinámico

## 🛠️ Stack Tecnológico

- **Frontend/Backend**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + Shadcn/UI
- **IA**: Google Gemini (configurable)
- **Datos**: Hardcodeados para desarrollo rápido
- **Hosting**: Vercel (recomendado)

## 📋 Prerequisitos

- Node.js 18+
- API key de Google Gemini (para IA)

## ⚡ Configuración Rápida

### 1. Clonar e instalar dependencias

```bash
git clone <tu-repo>
cd fanNews
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env.local

# Editar .env.local con tu API key de Gemini
```

**Variables requeridas:**

```env
# AI APIs
GOOGLE_AI_API_KEY=tu_clave_gemini
GOOGLE_AI_API_KEY_EMBEDDINGS=tu_clave_gemini_embeddings (opcional)
OPENAI_API_KEY=tu_clave_openai (opcional, fallback)
```

### 3. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la clave y agrégala a tu `.env.local`

### 4. Probar integración con IA

```bash
# Probar Gemini API
npm run test-gemini
```

### 5. Ejecutar aplicación

```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000) 🎉

### 6. Probar API de Gemini

```bash
# Probar desde el navegador
curl http://localhost:3000/api/test-gemini
```

## 🧪 Testing

- **Feed**: `http://localhost:3000`
- **Test Gemini**: `http://localhost:3000/api/test-gemini`

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── feed/          # Feed principal
│   │   └── test-gemini/   # Test de Gemini
│   ├── news/[id]/         # Páginas de detalle
│   └── ephemeris/[id]/    # Páginas de efemérides
├── components/            # Componentes React
│   ├── cards/            # Tarjetas de contenido
│   ├── layout/           # Layout components
│   └── ui/               # Shadcn/UI components
├── lib/                   # Utilidades y servicios
│   ├── aiService.ts      # Servicio de IA
│   ├── mockFeed.ts       # Datos hardcodeados
│   ├── types.ts          # Tipos TypeScript
│   └── sanitize.ts       # Sanitización de contenido
└── scripts/              # Scripts de utilidad
    └── test-gemini.js    # Test de Gemini
```

## 🔧 Configuración de IA

### Integración con Gemini

**Características de Gemini:**

- ✅ Resúmenes automáticos de noticias
- ✅ Contenido histórico para efemérides
- ✅ Prompts optimizados para fútbol argentino
- ✅ Sanitización automática de contenido
- ✅ Fallback a OpenAI si Gemini falla
- ✅ Fallback a resúmenes mock si no hay APIs configuradas

**Obtener API Key:**

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API key
3. Copia y pega en `.env.local`

**Costos:** Gemini es muy económico para este uso (~$0.001 por resumen)

## 🚀 Roadmap

- [ ] **Fase 2**: Base de datos real (PostgreSQL/Supabase)
- [ ] **Fase 3**: Cuentas de usuario y suscripciones
- [ ] **Fase 4**: Expansión a otros equipos
- [ ] **Fase 5**: Motor de personalización
- [ ] **Fase 6**: Análisis avanzados con IA

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Add nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
