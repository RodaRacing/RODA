import json
import random
import os

# Load questions from JSON file
QUESTIONS_FILE = os.path.join(os.path.dirname(__file__), 'questions.json')

def load_questions():
    with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def ask_question(q):
    print('\n' + q['question'])
    options = q['options']
    for idx, opt in enumerate(options, 1):
        print(f" {idx}. {opt}")
    while True:
        try:
            choice = int(input('Tu respuesta: ')) - 1
            if 0 <= choice < len(options):
                break
            else:
                print('Elige un número válido.')
        except ValueError:
            print('Introduce un número.')
    is_correct = choice == q['answer']
    if is_correct:
        print('Correcto!')
    else:
        print(f"Incorrecto. La respuesta correcta es: {options[q['answer']]}")
    return is_correct

def run_quiz():
    questions = load_questions()
    random.shuffle(questions)
    score = 0
    for q in questions:
        if ask_question(q):
            score += 1
    print(f"\nHas obtenido {score} de {len(questions)} respuestas correctas.")

if __name__ == '__main__':
    run_quiz()
