# Car Hotspot Automation (Kotlin)

Implementación base para automatizar el encendido/apagado del hotspot en función de la conexión Bluetooth del coche.

## Entregables incluidos

- `CarBluetoothReceiver.kt`: escucha `BluetoothDevice.ACTION_ACL_CONNECTED` y `ACTION_ACL_DISCONNECTED`, filtra por MAC/nombre y notifica al servicio.
- `HotspotForegroundService.kt`: mantiene proceso en primer plano con notificación persistente e intenta gestionar hotspot según versión de Android.
- `AndroidManifest.xml`: permisos, receiver y foreground service.

## Consideraciones Android 11/12/13+

1. **No existe API pública estable para activar/desactivar tethering completo** (compartir datos móviles) para apps de terceros.
2. `TetheringManager.startTethering(...)` normalmente requiere permisos privilegiados (`TETHER_PRIVILEGED`), reservados para apps de sistema/OEM.
3. `WRITE_SETTINGS` puede servir en escenarios legacy, pero en Android modernos ya no garantiza el control total del hotspot.
4. La alternativa soportada por API pública es `WifiManager.startLocalOnlyHotspot()`, que **no comparte internet móvil**.
5. En práctica, para Android 11+ la estrategia recomendada para apps normales es:
   - Abrir la pantalla de ajustes de hotspot mediante `Intent` (ej. `Settings.ACTION_WIRELESS_SETTINGS` o pantalla específica del OEM).
   - Opcionalmente usar automatización por accesibilidad (con consentimiento explícito del usuario), sabiendo que es más frágil por cambios de UI.

## Permisos clave

- `BLUETOOTH_CONNECT` (Android 12+)
- `ACCESS_FINE_LOCATION` (compatibilidad de metadatos/escaneo BT en versiones previas)
- `FOREGROUND_SERVICE`
- `WRITE_SETTINGS` (permiso especial: el usuario debe habilitarlo manualmente en ajustes)

## Nota práctica

Si necesitas una solución robusta sin pelear con restricciones OEM/API, considera herramientas como **MacroDroid** o **Tasker**, que ya cubren parte de estos flujos de automatización con configuraciones del usuario.
