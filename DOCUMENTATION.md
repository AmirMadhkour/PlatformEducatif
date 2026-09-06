# EduPlatform — Documentation technique

\---

## 1\. Logiciels à installer sur votre machine

1. **Java 17**
2. **Node.js** — version 18 ou plus récente
3. **PostgreSQL 17**
4. **Maven** 

\---

## 2\. Bibliothèques du projet (installées automatiquement)

Rien à installer manuellement ici — `mvn` et `npm` les téléchargent tout seuls. Liste
donnée pour information et en cas de problème de version.

### Backend

*(voir `backend/pom.xml`)*

* Spring Boot 3.3.4 
* PostgreSQL driver
* JJWT 0.12.6 
* Springdoc OpenAPI 
* Lombok

### Frontend

*(voir `frontend/package.json`)*

* React 18.3.1, React DOM
* React Router DOM 6.28.0
* MUI (Material UI) 6.1.6 + MUI Icons
* Emotion (react + styled) 
* Axios 1.7.7
* react-hook-form 7.53.2 + @hookform/resolvers + yup — formulaires et validation
* Recharts 2.12.7 — graphiques 
* Vite 5.4.11 

\---

## 3\. Installation

1. Créez une base PostgreSQL vide.
2. Ouvrez `backend/src/main/resources/application.properties` et vérifiez l'URL/utilisateur/mot de passe de connexion à votre base.
3. Définissez les 3 variables d'environnement Zoom (voir Configuration Zoom) avec `setx`.
4. Fermez votre terminal et ouvrez-en un nouveau (obligatoire après `setx`).
5. Dans ce nouveau terminal : `cd backend` puis `mvn clean spring-boot:run`.
6. Dans un autre terminal : `cd frontend` puis `npm install` puis `npm run dev`.
7. Ouvrez `http://localhost:5173` dans votre navigateur.

\---

## 4\. Configuration Zoom

1. Allez sur le Zoom App Marketplace et ouvrez votre app (type Server-to-Server OAuth).
2. Onglet **App Credentials** : notez l'Account ID, le Client ID et le Client Secret.
3. Onglet **Scopes** : cliquez "+ Add Scopes", cherchez "meeting", cochez `meeting:write:meeting` et `meeting:write:meeting:admin`.
4. Dans un terminal PowerShell, tapez :

```powershell
   setx ZOOM\_ACCOUNT\_ID "votre-account-id"
   setx ZOOM\_CLIENT\_ID "votre-client-id"
   setx ZOOM\_CLIENT\_SECRET "votre-client-secret"
   ```

5. Fermez ce terminal et ouvrez-en un nouveau avant de lancer le backend — `setx` ne met pas à jour le terminal déjà ouvert.

\---

## 5\. Erreurs déjà rencontrées et leurs solutions

### 5.1 — `No enum constant ... Niveau.xxx`

1. Ouvrez pgAdmin, sélectionnez votre base, ouvrez le Query Tool.
2. Cherchez la ligne fautive dans les tables `eleves`, `cours`, `cours\_en\_ligne`, `enseignant\_niveaux` avec une valeur de niveau qui n'est pas parmi : `SEPTIEME`, `HUITIEME`, `NEUVIEME`, `PREMIERE\_SECONDAIRE`, `DEUXIEME\_SECONDAIRE`, `TROISIEME\_SECONDAIRE`, `BACCALAUREAT`.
3. Corrigez-la avec `UPDATE nom\_table SET niveau = 'BACCALAUREAT' WHERE id = ...` (adapter la vraie valeur voulue).

### 5.2 — `column ... does not exist`

1. Le message indique le nom de la colonne manquante et de la table.
2. Dans pgAdmin : `ALTER TABLE nom\_table ADD COLUMN nom\_colonne TYPE;` (type à déduire du champ Java correspondant, ex. VARCHAR pour un texte).

### 5.3 — `null value in column "x" violates not-null constraint`

1. Vérifiez si le champ existe encore dans l'entité Java correspondante.
2. S'il existe encore mais est optionnel : `ALTER TABLE nom\_table ALTER COLUMN nom\_colonne DROP NOT NULL;`
3. S'il n'existe plus du tout dans le code : `ALTER TABLE nom\_table DROP COLUMN IF EXISTS nom\_colonne;`

### 5.4 — `No static resource api/xxx`

1. Arrêtez le serveur frontend (Ctrl+C).
2. Relancez `npm install` puis `npm run dev`.
3. Dans le navigateur, faites Ctrl+Shift+R (rechargement forcé) sur la page concernée.

### 5.5 — `L'integration Zoom n'est pas configuree sur ce serveur`

1. Vérifiez que les 3 variables ont bien été définies avec `setx` 
2. Fermez le terminal actuel, ouvrez-en un nouveau.
3. Tapez `echo $env:ZOOM\_ACCOUNT\_ID` — si rien ne s'affiche, refaites `setx`.
4. Relancez `mvn clean spring-boot:run` dans ce nouveau terminal.

### 5.6 — `Invalid access token, does not contain scopes`

1. Retournez sur Zoom App Marketplace → votre app → onglet Scopes.
2. Vérifiez que `meeting:write:meeting` et `meeting:write:meeting:admin` sont bien cochés.
3. Cliquez Continue/Save.
4. Aucun redémarrage nécessaire, retestez directement.

### 5.7 — Mes changements de code ne sont pas pris en compte

1. Arrêtez le backend (Ctrl+C).
2. Relancez avec `mvn clean spring-boot:run` — jamais `mvn spring-boot:run` seul.

### 5.8 — Une variable d'environnement définie hier ne fonctionne plus

1. `$env:VAR = "valeur"` ne dure que le temps du terminal ouvert — c'est normal qu'elle disparaisse.
2. Utilisez `setx VAR "valeur"` à la place.
3. Ouvrez un nouveau terminal après le `setx`.

### 5.9 — `LazyInitializationException`

1. Repérez la collection concernée dans le message d'erreur (nom de la relation JPA).
2. Dans le service qui la charge, entourez-la de `new HashSet<>(...)` avant qu'elle ne sorte de la méthode transactionnelle.

\---

## 6\. Règles à respecter

1. Toujours exécuter une migration SQL avant de redémarrer le backend, jamais après.
2. Après avoir modifié un champ d'entité Java, vérifiez la vraie colonne en base avant de supposer qu'elle a changé toute seule.
3. Ne jamais écrire un secret (mot de passe, clé API) dans un fichier du projet.
4. Toujours `mvn clean spring-boot:run`, jamais `mvn spring-boot:run` seul.

\---

## 7\. Structure des dossiers

```
backend/src/main/java/com/education/plateforme/
├── entity/
├── dto/
│   ├── request/
│   └── response/
├── repository/
├── service/
│   └── impl/
├── controller/
└── mapper/

frontend/src/
├── pages/
│   ├── admin/
│   ├── enseignant/
│   ├── eleve/
│   ├── public/
│   └── auth/
├── components/
├── services/
├── context/
└── constants/
```

