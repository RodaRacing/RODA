package com.example.carhotspot

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import androidx.core.app.NotificationCompat

class HotspotForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "car_hotspot_channel"
        const val NOTIFICATION_ID = 1001

        const val ACTION_START_MONITORING = "com.example.carhotspot.ACTION_START_MONITORING"
        const val ACTION_CAR_CONNECTED = "com.example.carhotspot.ACTION_CAR_CONNECTED"
        const val ACTION_CAR_DISCONNECTED = "com.example.carhotspot.ACTION_CAR_DISCONNECTED"

        const val EXTRA_DEVICE_NAME = "extra_device_name"
        const val EXTRA_DEVICE_MAC = "extra_device_mac"
    }

    private var localOnlyReservation: WifiManager.LocalOnlyHotspotReservation? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification("Monitoreando Bluetooth del coche"))
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START_MONITORING -> {
                updateNotification("Servicio activo y escuchando conexión del coche")
            }

            ACTION_CAR_CONNECTED -> {
                val name = intent.getStringExtra(EXTRA_DEVICE_NAME) ?: "Coche"
                val ok = enableHotspotOrFallback()
                val message = if (ok) {
                    "Conectado a $name: intento de hotspot ejecutado"
                } else {
                    "Conectado a $name: abre ajustes para activar hotspot manualmente"
                }
                updateNotification(message)
            }

            ACTION_CAR_DISCONNECTED -> {
                val name = intent.getStringExtra(EXTRA_DEVICE_NAME) ?: "Coche"
                val ok = disableHotspotOrFallback()
                val message = if (ok) {
                    "Desconectado de $name: intento de apagado de hotspot ejecutado"
                } else {
                    "Desconectado de $name: abre ajustes para desactivar hotspot manualmente"
                }
                updateNotification(message)
            }
        }

        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun enableHotspotOrFallback(): Boolean {
        // Android 11/12/13+: No hay API pública para Tethering completo para apps normales.
        // Se usa LocalOnlyHotspot (sin compartir internet móvil) como alternativa técnica.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val wifiManager = applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
            return try {
                wifiManager.startLocalOnlyHotspot(
                    object : WifiManager.LocalOnlyHotspotCallback() {
                        override fun onStarted(reservation: WifiManager.LocalOnlyHotspotReservation) {
                            localOnlyReservation = reservation
                        }
                    },
                    null
                )
                true
            } catch (_: Exception) {
                openTetherSettings()
                false
            }
        }

        // APIs antiguas (pre-O): posible por reflexión + WRITE_SETTINGS.
        return setLegacyWifiApEnabled(true)
    }

    private fun disableHotspotOrFallback(): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Cierra la sesión LocalOnlyHotspot si se abrió.
            localOnlyReservation?.close()
            localOnlyReservation = null

            // Intento no privilegiado en APIs modernas: abrir ajustes de hotspot.
            openTetherSettings()
            return false
        }

        return setLegacyWifiApEnabled(false)
    }

    @Suppress("DEPRECATION")
    private fun setLegacyWifiApEnabled(enabled: Boolean): Boolean {
        if (!Settings.System.canWrite(this)) {
            openWriteSettingsScreen()
            return false
        }

        return try {
            val wifiManager = applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
            val method = wifiManager.javaClass.getMethod("setWifiApEnabled", android.net.wifi.WifiConfiguration::class.java, Boolean::class.javaPrimitiveType)
            method.invoke(wifiManager, null, enabled)
            true
        } catch (_: Exception) {
            openTetherSettings()
            false
        }
    }

    private fun openWriteSettingsScreen() {
        val intent = Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS).apply {
            data = android.net.Uri.parse("package:$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }

    private fun openTetherSettings() {
        val intent = Intent().apply {
            action = Settings.ACTION_WIRELESS_SETTINGS
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Car Hotspot Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(contentText: String): Notification {
        val openSettingsIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(Settings.ACTION_WIRELESS_SETTINGS),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .setContentTitle("Car Hotspot Automation")
            .setContentText(contentText)
            .setContentIntent(openSettingsIntent)
            .setOngoing(true)
            .build()
    }

    private fun updateNotification(text: String) {
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(NOTIFICATION_ID, buildNotification(text))
    }
}
