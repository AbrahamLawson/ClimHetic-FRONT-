# 🚀 Guide de Déploiement ClimHetic

## 📋 Méthodes de Déploiement

### 1. 🤖 Déploiement Automatique (GitHub Actions)
- **Quand** : À chaque push sur la branche `main`
- **Où** : Se déclenche automatiquement via GitHub Actions
- **Statut** : Configuré dans `.github/workflows/deploy.yml`

### 2. 🛠️ Déploiement Manuel (Recommandé)
Utilisez le script `deploy.sh` directement sur votre serveur :

```bash
# Sur votre serveur
./deploy.sh
```

### 3. 📱 Déploiement Manuel Étape par Étape

```bash
# 1. Se connecter au serveur
ssh abraham@admin-hetic.arcplex.tech -p 2326

# 2. Aller dans le répertoire du projet
cd /home/abraham/climhetic-front

# 3. Arrêter les conteneurs existants
docker stop $(docker ps -q --filter "publish=8080") 2>/dev/null || true
docker rm $(docker ps -aq --filter "publish=8080") 2>/dev/null || true

# 4. Mettre à jour le code
git fetch origin main
git reset --hard origin/main

# 5. Relancer l'application
docker-compose -f deployment/docker-compose.yml up --build -d

# 6. Vérifier que ça marche
docker-compose -f deployment/docker-compose.yml ps
```

## 🔧 Résolution des Problèmes Courants

### Port 8080 déjà utilisé
```bash
# Voir qui utilise le port
docker ps --filter "publish=8080"

# Arrêter tous les conteneurs sur ce port
docker stop $(docker ps -q --filter "publish=8080")
docker rm $(docker ps -aq --filter "publish=8080")
```

### Problème de permissions Docker
```bash
# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker abraham

# Se reconnecter pour appliquer les changements
exit
# puis se reconnecter
```

### Voir les logs en cas d'erreur
```bash
# Logs des conteneurs
docker-compose -f deployment/docker-compose.yml logs

# Logs en temps réel
docker-compose -f deployment/docker-compose.yml logs -f
```

## 🌐 Accès à l'Application

- **URL** : http://09.hetic.arcplex.dev
- **Port** : 8080
- **Serveur** : admin-hetic.arcplex.tech

## 📁 Structure du Projet

```
ClimHetic-FRONT-/
├── deployment/           # Configuration Docker
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── nginx.conf
├── .github/workflows/    # GitHub Actions
│   └── deploy.yml
├── deploy.sh            # Script de déploiement manuel
└── src/                 # Code source React
```

## ✅ Checklist de Déploiement

- [ ] Code pushé sur GitHub (branche main)
- [ ] Serveur accessible via SSH
- [ ] Docker installé et fonctionnel
- [ ] Port 8080 libre
- [ ] Permissions Docker configurées
- [ ] Application accessible sur http://09.hetic.arcplex.dev
