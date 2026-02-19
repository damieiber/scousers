# Guía de Pruebas: Nuevas Funcionalidades FanNews

Este documento detalla dónde encontrar y cómo probar las 12 nuevas funcionalidades implementadas en el sistema.

---

## 📍 Centro de Partido
**Ruta:** `/match-center`
**Descripción:** Dashboard unificado para el análisis del próximo encuentro (actualmente mockeado: River Plate vs Racing).

1.  **Previa de Partido Integrada (Feature #10)**
    *   **Qué ver:** Cabecera con escudos, estadio, árbitro y clima.
    *   **Ubicación:** Parte superior de la página.

2.  **Tablero Táctico Automático (Feature #1)**
    *   **Qué ver:** Gráficos de zonas de ataque (Izquierda/Centro/Derecha) y posesión.
    *   **Ubicación:** Primeras tarjetas en la grilla (Local y Visitante).

3.  **Eficacia a Balón Parado (Feature #2)**
    *   **Qué ver:** Estadísticas de córners y tiros libres (A favor/En contra) con tendencias.
    *   **Ubicación:** Debajo o al lado del tablero táctico.

4.  **Índice de Riesgo (Feature #3)**
    *   **Qué ver:** Medidor tipo "termómetro" (Bajo/Medio/Alto) con factores clave (ej. bajas, historial).
    *   **Ubicación:** Tarjeta destacada en la grilla.

5.  **H2H Compacto (Feature #4)**
    *   **Qué ver:** Historial de los últimos 5 partidos y tabla comparativa de victorias/goles.
    *   **Ubicación:** Tarjeta en la grilla.

6.  **Odds "Quién Paga Más" (Feature #11)**
    *   **Qué ver:** Comparativa de cuotas (Bet365 vs Codere) para Local/Empate/Visitante.
    *   **Ubicación:** Al final de la sección, ocupando el ancho completo o destacado.

---

## 📍 Plantel Profesional
**Ruta:** `/squad`
**Descripción:** Herramientas para la gestión y análisis del rendimiento de los jugadores.

7.  **Formómetro de Jugadores (Feature #5)**
    *   **Qué ver:** Top 5 jugadores con mejor rating en los últimos 5 partidos.
    *   **Ubicación:** Primera columna.

8.  **Mapa de Minutos y Carga (Feature #6)**
    *   **Qué ver:** Barras de progreso indicando acumulación de minutos y alertas de fatiga (Verde/Amarillo/Rojo).
    *   **Ubicación:** Debajo del formómetro.

9.  **Monitor de Mercado de Pases (Feature #7)**
    *   **Qué ver:** Tarjetas de Altas y Bajas con un "Score de Impacto" y análisis breve.
    *   **Ubicación:** Columna central.

10. **Cantera y Reserva (Feature #9)**
    *   **Qué ver:** Tarjeta "Prospecto de la Semana" destacando a un juvenil.
    *   **Ubicación:** Debajo del monitor de mercado.

11. **Loan Watch (Cedidos) (Feature #8)**
    *   **Qué ver:** Rendimiento de jugadores a préstamo en otros clubes.
    *   **Ubicación:** Tercera columna.

---

## 📍 Tablas y Competencias
**Ruta:** `/standings`
**Descripción:** Seguimiento de posiciones en múltiples torneos.

12. **Tabla Multi-Competencia (Feature #12)**
    *   **Qué ver:** Tablas de posiciones de Liga Profesional y Copa Libertadores (fase de grupos).
    *   **Ubicación:** Listado principal de la página.

---

### 📝 Notas Técnicas
*   **Datos:** Actualmente todos los datos son **simulados (mock)** pero realistas para facilitar la prueba de UI/UX.
*   **Arquitectura:** El sistema está preparado para conectarse a la API real cambiando una configuración en `lib/services/index.ts`.
