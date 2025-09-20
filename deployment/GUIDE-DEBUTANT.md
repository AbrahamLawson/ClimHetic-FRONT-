# 🚀 Guide Déploiement ClimHetic - Version Débutant

## 📚 **Qu'est-ce qu'on fait ?**

On va mettre ton application React sur un serveur pour que tout le monde puisse y accéder via internet.

## 🛠️ **Les outils qu'on utilise**

- **Docker** : Met ton app dans une "boîte" qui marche partout
- **Nginx** : Serveur web qui montre ton app aux visiteurs
- **SSH** : Pour se connecter au serveur à distance

## 📦 **Les fichiers importants**

- `Dockerfile.simple` : Instructions pour créer la "boîte" Docker
- `docker-compose.simple.yml` : Lance ton app facilement
- `deploy-simple.sh` : Script qui fait tout automatiquement
- `nginx-simple.conf` : Configuration du serveur web

## 🎯 **Déploiement en 3 étapes**

### **Étape 1 : Transférer les fichiers**
```bash
# Depuis ton ordinateur
./upload-to-server.sh
```

### **Étape 2 : Se connecter au serveur**
```bash
ssh abraham@admin-hetic.arcplex.tech -p 2326
cd climhetic-front
```

### **Étape 3 : Lancer l'application**
```bash
chmod +x deploy-simple.sh
./deploy-simple.sh
```

## 🌐 **Configurer nginx (une seule fois)**

```bash
# Copier la config nginx
sudo cp nginx-simple.conf /etc/nginx/sites-available/climhetic

# Activer le site
sudo ln -sf /etc/nginx/sites-available/climhetic /etc/nginx/sites-enabled/climhetic

# Désactiver le site par défaut
sudo rm -f /etc/nginx/sites-enabled/default

# Recharger nginx
sudo nginx -t && sudo systemctl reload nginx
```

## ✅ **Résultat**

Ton app sera accessible sur : **http://09.hetic.arcplex.dev**

## 🔧 **Commandes utiles**

```bash
# Voir si ton app tourne
docker ps

# Voir les logs de ton app
docker-compose -f docker-compose.simple.yml logs -f

# Arrêter ton app
docker-compose -f docker-compose.simple.yml down

# Redémarrer ton app
./deploy-simple.sh
```

## 🆘 **En cas de problème**

1. **L'app ne se lance pas** : Regarde les logs avec `docker logs climhetic-app`
2. **Le site n'est pas accessible** : Vérifie que nginx est configuré
3. **Erreur de build** : Assure-toi que `npm run build` marche en local

## 📝 **Explications simples**

### **Docker, c'est quoi ?**
Imagine une boîte qui contient ton app + tout ce dont elle a besoin. Cette boîte marche sur n'importe quel serveur.

### **Nginx, c'est quoi ?**
C'est comme un réceptionniste qui reçoit les visiteurs et les dirige vers ton app.

### **Le port 8080, c'est quoi ?**
C'est comme un numéro de porte. Ton app écoute à la "porte 8080" du serveur.

## 🎉 **C'est tout !**

Avec ces fichiers simplifiés, tu as tout ce qu'il faut pour déployer ton app facilement et comprendre ce qui se passe !
