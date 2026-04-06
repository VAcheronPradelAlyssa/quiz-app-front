
# Quiz App Frontend

Une application de quiz moderne, interactive et accessible, conçue pour impressionner les recruteurs et démontrer des compétences avancées en Angular, TypeScript et UX/UI.

## 🚀 Aperçu

- **Angular 21+** (standalone, signals, strict typing)
- **UX fluide et responsive**
- **Design fun et moderne**
- **Gestion d’état réactive**
- **Accessibilité (WCAG AA, AXE)**
- **Code maintenable, typé, scalable**

## 🎯 Fonctionnalités principales

- Liste des quiz dynamiques
- Détail d’un quiz avec navigation question par question
- Correction immédiate après chaque réponse (feedback visuel et textuel)
- Ajout/édition/suppression de quiz et de questions
- Formulaires réactifs robustes (Angular Reactive Forms)
- Navigation fluide (Angular Router)
- Appels API typés (CRUD quiz/questions)
- Sécurité : réponses verrouillées après sélection

## 🖥️ Démo rapide

1. **Lancer le projet**
	```bash
	npm install
	npm start
	```
	Accédez à [http://localhost:4200](http://localhost:4200)

2. **Créer, jouer, corriger !**
	- Créez vos quiz et questions
	- Jouez, répondez, obtenez un feedback immédiat
	- Recommencez ou éditez à volonté


## 📂 Structure du projet

- `src/app/components/quiz-list` : affichage des quiz
- `src/app/components/quiz-detail` : jeu et correction
- `src/app/components/quiz-form` : création/édition de quiz
- `src/app/components/question-form` : création/édition de question
- `src/app/models` : modèles typés (Quiz, Question)
- `src/app/services/quiz.ts` : appels API typés

## 🧑‍💻 Stack technique

- Angular 21+
- TypeScript strict
- SCSS modulaire
- Vitest (tests unitaires)
- API REST (backend local sur http://localhost:8080, production sur https://quizappback-cezk.onrender.com)
