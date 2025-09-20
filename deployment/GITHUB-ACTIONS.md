# 🚀 Déploiement Automatique avec GitHub Actions

## 🎯 **Qu'est-ce que ça fait ?**

À chaque fois que tu pousses du code sur GitHub, ton application se déploie **automatiquement** sur le serveur !

## ⚙️ **Configuration (à faire une seule fois)**

### **1. Pousser le code sur GitHub**
```bash
# Depuis ton ordinateur
git add .
git commit -m "🚀 Setup déploiement automatique"
git push origin main
```

### **2. Configurer le secret du mot de passe**

1. Va sur ton repo GitHub
2. Clique sur **Settings** (en haut)
3. Dans le menu de gauche : **Secrets and variables** → **Actions**
4. Clique **New repository secret**
5. Nom : `SERVER_PASSWORD`
6. Valeur : `abraham123` (ton mot de passe serveur)
7. Clique **Add secret**

### **3. Première configuration du serveur**

Connecte-toi **une seule fois** au serveur pour installer Git :

```bash
# Se connecter au serveur
ssh abraham@admin-hetic.arcplex.tech -p 2326

# Installer Git (si pas déjà fait)
sudo apt update
sudo apt install git

# Configurer Git (optionnel)
git config --global user.name "Abraham"
git config --global user.email "ton-email@example.com"
```

## 🎉 **C'est tout !**

Maintenant, à chaque fois que tu fais :

```bash
git add .
git commit -m "Mes changements"
git push
```

**Ton app se déploie automatiquement !** 🚀

## 📊 **Suivre le déploiement**

1. Va sur GitHub → ton repo
2. Clique sur l'onglet **Actions**
3. Tu verras le déploiement en cours avec des logs en temps réel

## 🔧 **Déploiement manuel**

Tu peux aussi déclencher un déploiement manuellement :

1. GitHub → ton repo → **Actions**
2. Clique sur **🚀 Déploiement ClimHetic**
3. Clique **Run workflow** → **Run workflow**

## 🆘 **En cas de problème**

### **Erreur de connexion SSH**
- Vérifie que le secret `SERVER_PASSWORD` est bien configuré
- Assure-toi que le serveur est accessible

### **Erreur Docker**
- Le script installe automatiquement Docker si nécessaire
- Parfois il faut se déconnecter/reconnecter au serveur après l'installation

### **Voir les logs**
- Va dans **Actions** sur GitHub pour voir les détails de l'erreur

## 🎯 **Avantages**

✅ **Automatique** : Push → Déploiement  
✅ **Logs complets** : Tu vois tout ce qui se passe  
✅ **Rollback facile** : Revenir à une version précédente  
✅ **Professionnel** : Comme les vraies entreprises  
✅ **Gratuit** : GitHub Actions est gratuit pour les repos publics  

## 🔄 **Workflow**

```
1. Tu modifies ton code
2. git add . && git commit -m "..." && git push
3. GitHub Actions se déclenche automatiquement
4. Ton serveur récupère le nouveau code
5. Docker rebuild et redémarre l'app
6. Ton app est mise à jour ! 🎉
```

**Fini les transferts manuels de fichiers !** 🚀
