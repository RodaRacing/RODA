package com.example.carhotspot

import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class CarBluetoothReceiver : BroadcastReceiver() {

    companion object {
        /**
         * Configuración rápida (hardcode). En producción puedes moverlo a SharedPreferences.
         */
        private const val CAR_DEVICE_MAC = "00:11:22:33:44:55"
        private const val CAR_DEVICE_NAME = "MiCoche_BT"
    }

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED -> {
                // Arranca servicio para quedar residente con notificación persistente.
                context.startForegroundService(
                    Intent(context, HotspotForegroundService::class.java).apply {
                        action = HotspotForegroundService.ACTION_START_MONITORING
                    }
                )
            }

            BluetoothDevice.ACTION_ACL_CONNECTED,
            BluetoothDevice.ACTION_ACL_DISCONNECTED -> {
                val device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE, BluetoothDevice::class.java)
                    ?: return

                if (!matchesCar(device)) return

                val serviceAction = if (intent.action == BluetoothDevice.ACTION_ACL_CONNECTED) {
                    HotspotForegroundService.ACTION_CAR_CONNECTED
                } else {
                    HotspotForegroundService.ACTION_CAR_DISCONNECTED
                }

                context.startForegroundService(
                    Intent(context, HotspotForegroundService::class.java).apply {
                        action = serviceAction
                        putExtra(HotspotForegroundService.EXTRA_DEVICE_NAME, device.name)
                        putExtra(HotspotForegroundService.EXTRA_DEVICE_MAC, device.address)
                    }
                )
            }
        }
    }

    private fun matchesCar(device: BluetoothDevice): Boolean {
        val macMatches = device.address.equals(CAR_DEVICE_MAC, ignoreCase = true)
        val nameMatches = device.name?.equals(CAR_DEVICE_NAME, ignoreCase = true) == true
        return macMatches || nameMatches
    }

    private fun <T> Intent.getParcelableExtra(key: String, clazz: Class<T>): T? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getParcelableExtra(key, clazz)
        } else {
            @Suppress("DEPRECATION")
            getParcelableExtra(key)
        }
    }
}
