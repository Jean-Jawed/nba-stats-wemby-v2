# Wemby Stats 🏀

Dashboard de stats pour Victor Wembanyama avec les San Antonio Spurs.

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Ton PC (local)    │     │   Neon (PostgreSQL) │     │      Vercel         │
│                     │     │                     │     │                     │
│ wemby_fetch_daily.py│────▶│   Table "games"     │◀────│    Next.js App      │
│ (Task Scheduler)    │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
        │                                                        
        │              IP résidentielle                          
        └──────────────▶ stats.nba.com                           
                         (API NBA)                               
```

## Structure du projet

```
wemby-stats/
├── scripts/
│   ├── wemby_fetch_daily.py   # Script de fetch quotidien
│   └── requirements.txt       # Dépendances Python
├── src/
│   ├── app/
│   │   ├── page.tsx           # Page principale
│   │   ├── layout.tsx         # Layout + metadata
│   │   └── globals.css        # Styles
│   ├── components/            # Composants React
│   │   ├── Hero.tsx
│   │   ├── LastGame.tsx
│   │   ├── Blocks.tsx
│   │   ├── PointsChart.tsx
│   │   ├── Shooting.tsx
│   │   ├── Defense.tsx
│   │   ├── Impact.tsx
│   │   ├── ShotChart.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── db.ts              # Connexion Neon
├── public/
│   └── assets/
│       ├── images/            # Tes images
│       └── videos/            # Tes vidéos
├── .env.local                 # Variables d'environnement
├── neon_schema.sql            # Schéma PostgreSQL
└── package.json
```

---

## Installation

### 1. Créer la base Neon

1. Va sur [neon.tech](https://neon.tech) et crée un compte
2. Crée un nouveau projet
3. Copie la **connection string** (pooled)
4. Dans la console SQL, exécute le contenu de `neon_schema.sql`

### 2. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
DATABASE_URL='postgresql://neondb_owner:XXXXX@ep-XXXXX-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'
```

### 3. Installer les dépendances Next.js

```bash
npm install
```

### 4. Lancer en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

### 5. Copier les assets

Place tes images et vidéos dans :
- `public/assets/images/` (spurs.png, block1.png, etc.)
- `public/assets/videos/` (10playsRookie.mp4, etc.)

---

## Script Python (Fetch quotidien)

### Installation

```bash
cd scripts
pip install -r requirements.txt
```

### Test manuel

```bash
python wemby_fetch_daily.py
```

### Configurer Task Scheduler (Windows)

1. Ouvre **Task Scheduler**
2. Créer une tâche :
   - Nom : `Wemby Stats Fetch`
   - Déclencheur : Daily, répéter toutes les 3h
   - Action :
     - Programme : `C:\...\python.exe`
     - Arguments : `"C:\...\scripts\wemby_fetch_daily.py"`
     - Démarrer dans : `C:\...\scripts\`
3. Propriétés :
   - ✅ "Exécuter la tâche dès que possible si un démarrage planifié est manqué"

---

## Déploiement sur Vercel

### 1. Push sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ton-user/wemby-stats.git
git push -u origin main
```

### 2. Connecter à Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Import ton repo GitHub
3. Ajoute la variable d'environnement `DATABASE_URL`
4. Deploy !

---

## Fichiers générés par le script Python

| Fichier | Description |
|---------|-------------|
| `scripts/last_run.txt` | Date/heure du dernier fetch |
| `scripts/wemby_fetch.log` | Logs d'exécution |

Ces fichiers sont gitignorés.

---

## Debugging

### Le script ne fetch pas
- Vérifie `scripts/wemby_fetch.log`
- Vérifie que `last_run.txt` n'a pas une date < 12h
- Teste : `python wemby_fetch_daily.py`

### Erreur connexion Neon
- Vérifie ta connection string dans `.env.local`
- Vérifie que le projet Neon n'est pas en pause

### Le site n'affiche pas les données
- Vérifie la console du navigateur (F12)
- Vérifie que des données existent dans Neon
- Relance `npm run dev`

---

## Stack technique

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript
- **Base de données** : Neon (PostgreSQL serverless)
- **Hébergement** : Vercel
- **Data fetching** : Script Python local + nba_api
- **Styling** : CSS custom (variables CSS, animations)

---

Made with ❤️ by [Jawed](https://jawed.fr)
