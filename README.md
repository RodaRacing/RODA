# RODA - KiCad project

Proyecto KiCad generado para el circuito **ESP32 Gear Sensor + N-Light** sin modificar los valores del esquema probado.

## Abrir en KiCad

1. Abre KiCad 8 (o 7 reciente).
2. `File > Open Project...`
3. Selecciona `kicad/ESP32_Gear_NLight/ESP32_Gear_NLight.kicad_pro`.
4. Abre el PCB Editor para revisar la placa de **50x70 mm**.

## Archivos

- `ESP32_Gear_NLight.kicad_pro`: proyecto.
- `ESP32_Gear_NLight.kicad_sch`: plantilla mínima de esquemático.
- `ESP32_Gear_NLight.kicad_pcb`: layout base con:
  - Headers 2x15 para ESP32 DevKit 30 pines.
  - Borneras J1/J2/J3 de 2 pines.
  - R1, R2, R3, C1 y Q1 (2N2222) en THT.
  - Nets clave: `ADC_IN`, `GPIO_D23`, `VIN_5V`, `N_LIGHT`, `GND`.

## Nota

El encapsulado TO-92 del 2N2222 puede variar según fabricante (E-B-C o C-B-E). Verifica el pinout real del transistor antes de fabricar.
