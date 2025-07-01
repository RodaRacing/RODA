"""Command-line interface for RODA app."""

from typing import Callable



def main() -> None:
    """Run the main menu to start practice sessions."""
    while True:
        print("\nMENU PRINCIPAL")
        print("1. Iniciar sesión de práctica")
        print("2. Salir")
        choice = input("Seleccione una opción: ").strip()
        if choice == "1":
            print("Iniciando sesión de práctica...")
            # Aquí se podría agregar la lógica real de inicio de sesión
        elif choice == "2":
            print("¡Hasta pronto!")
            break
        else:
            print("Opción no válida. Intente nuevamente.")


if __name__ == "__main__":
    main()
