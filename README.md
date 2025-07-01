# Aplicación de estudio para oposiciones de FP en Automoción

Este proyecto proporciona una sencilla aplicación de consola que permite
repasar preguntas tipo test relacionadas con el mantenimiento de vehículos.

## Requisitos

- Python 3.7 o superior

## Uso

1. Ejecuta el programa desde la terminal:

```bash
python3 app.py
```

2. Se mostrarán las preguntas de forma aleatoria. Escribe el número de la
   respuesta que consideres correcta.
3. Al final obtendrás un resumen de aciertos.

## Añadir nuevas preguntas

Las preguntas se encuentran en el archivo `questions.json`. Cada entrada
sigue el siguiente formato:

```json
{
  "question": "Texto de la pregunta",
  "options": ["Opción 1", "Opción 2", "Opción 3"],
  "answer": 0
}
```

Donde `answer` es el índice (comenzando en 0) de la opción correcta.

Puedes añadir tantas preguntas como desees siguiendo el mismo esquema.
