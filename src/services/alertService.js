import capteurService from './capteurService';

export const alertService = {
 
  async getAllAlertes() {
    try {
      console.log('AlertService: Début récupération des alertes');
      
      const [capteursResponse, conformiteResponse] = await Promise.all([
        capteurService.getAllCapteurs(),
        capteurService.getConformiteSalles(10) 
      ]);
      
      console.log('Réponse capteurs:', capteursResponse);
      console.log('Réponse conformité:', conformiteResponse);
      
      if (!conformiteResponse.success || !conformiteResponse.data) {
        console.warn('Pas de données de conformité disponibles');
        return { success: false, data: { alertes: [], stats: {} } };
      }

      const conformiteData = conformiteResponse.data.salles || [];
      console.log('Données de conformité récupérées:', conformiteData.length, 'salles');
      
      const alertes = this.genererAlertes(conformiteData);
      console.log('Alertes générées:', alertes.length, 'alertes');
      
      const stats = this.calculerStatistiques(alertes);
      console.log('Stats calculées:', stats);
      
      return {
        success: true,
        data: {
          alertes: alertes,
          stats: stats
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      return { 
        success: false, 
        error: error.message,
        data: { alertes: [], stats: {} }
      };
    }
  },


  genererAlertes(conformiteData) {
    const toutesLesSalles = conformiteData.map((item) => {
      const salle = item.salle;
      const moyennes = item.moyennes;
      const detailsVerification = item.details_verification;
      const alertes = item.alertes || [];
      
      let status = "Success";
      
      if (item.statut === 'AUCUNE_DONNEE') {
        status = "Warning"; 
      }
      else if (item.statut === 'SEUILS_NON_DEFINIS') {
        status = "Warning"; 
      }
      else if (item.statut === 'CONFORME') {
        status = "Success"; 
      }
      else if (item.statut === 'NON_CONFORME') {
        if (detailsVerification) {
          const scoreConformite = detailsVerification.score_conformite;
          const niveauConformite = detailsVerification.niveau_conformite;
          
          if (niveauConformite === "EXCELLENT" || scoreConformite === 1) {
            status = "Success";
          } else if (niveauConformite === "BON" || scoreConformite === 2) {
            status = "Warning";
          } else if (niveauConformite === "MOYEN" || scoreConformite === 3) {
            status = "Critical";
          } else if (niveauConformite === "MAUVAIS" || scoreConformite === 4) {
            status = "Danger";
          }
        } else {
          status = "Warning";
        }
      }
      
      return {
        id: salle.id,
        salle: salle.nom,
        temperature: moyennes?.moyenne_temperature ? Math.round(moyennes.moyenne_temperature * 10) / 10 : null,
        humidite: moyennes?.moyenne_humidite ? Math.round(moyennes.moyenne_humidite * 10) / 10 : null,
        pression: moyennes?.moyenne_pression ? Math.round(moyennes.moyenne_pression * 10) / 10 : null,
        status: status,
        rawData: {
          statut: item.statut,
          alertes: alertes,
          detailsVerification: detailsVerification,
          moyennes: moyennes,
          capteurs: item.capteurs || []
        }
      };
    }).filter((salle) => {
      return salle.temperature !== null || salle.humidite !== null || salle.pression !== null;
    });

    console.log('AlertService - Statuts des salles:', toutesLesSalles.map(s => ({nom: s.salle, status: s.status})));
    const sallesProblematiques = toutesLesSalles.filter((salle) => salle.status !== "Success");
    console.log('AlertService - Salles problématiques:', sallesProblematiques.length, 'sur', toutesLesSalles.length);
    
    const alertesGenerees = sallesProblematiques.map((salle) => {
      const rawData = salle.rawData;
      const alertes = rawData.alertes || [];
      const moyennes = rawData.moyennes;
      const capteurs = rawData.capteurs || []; 
      const derniereMesureDate = moyennes?.derniere_mesure_date; 
      
      let type = "Warning";
      let title = "Problème détecté";
      
      if (salle.status === "Danger") {
        type = "Danger";
        title = "Situation critique";
      } else if (salle.status === "Critical") {
        type = "Critical";
        title = "Alerte conformité";
      } else if (salle.status === "Warning") {
        type = "Warning";
        title = "Surveillance requise";
      }
      
      const valeursProblematiques = [];
      
      alertes.forEach(alerte => {
        const tempMatch = alerte.match(/Température.*?(\d+\.?\d*)°C/);
        if (tempMatch) {
          valeursProblematiques.push(`${tempMatch[1]}°C`);
        }
        
        const humMatch = alerte.match(/Humidité.*?(\d+\.?\d*)%/);
        if (humMatch) {
          valeursProblematiques.push(`${humMatch[1]}%`);
        }
        
        const pressMatch = alerte.match(/Pression.*?(\d+\.?\d*)hPa/);
        if (pressMatch) {
          valeursProblematiques.push(`${pressMatch[1]}hPa`);
        }
      });
      
      const valeurs = valeursProblematiques.length > 0 ? valeursProblematiques : [`Statut: ${salle.status}`];
      
      let dateFormatee = new Date().toLocaleDateString('fr-FR');
      let heureFormatee = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      
      if (derniereMesureDate && derniereMesureDate !== '1900-01-01 00:00:00') {
        const dateMesure = new Date(derniereMesureDate);
        dateFormatee = dateMesure.toLocaleDateString('fr-FR');
        heureFormatee = dateMesure.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
      
      const capteursStrings = capteurs.length > 0 
        ? (() => {
            const capteursUniques = {};
            capteurs.forEach(capteur => {
              const nom = capteur.nom;
              if (!capteursUniques[nom]) {
                capteursUniques[nom] = [];
              }
              capteursUniques[nom].push(capteur.type_capteur);
            });
            
            return Object.keys(capteursUniques).map(nom => {
              const types = capteursUniques[nom];
              if (types.length === 1) {
                return `${nom} (${types[0]})`;
              } else {
                return nom; 
              }
            });
          })()
        : [`Statut: ${salle.status}`];
      
      return {
        id: `alert_${salle.id}_${Date.now()}`, 
        room: salle.salle,
        title: title,
        metric: valeurs.join(" | "),
        type: type,
        date: dateFormatee, 
        time: heureFormatee, 
        sensors: capteursStrings,
        recommendation: alertes.length > 0 ? alertes.join(" | ") : "Aucune recommandation spécifique", 
        read: false,
        details: {
          statut: rawData.statut,
          score: rawData.detailsVerification?.score_conformite,
          niveau: rawData.detailsVerification?.niveau_conformite,
          pourcentage: rawData.detailsVerification?.pourcentage_conformite
        }
      };
    });
    
    const alertesTriees = alertesGenerees.sort((a, b) => {
      const prioriteNiveau = {
        'Danger': 1,     
        'Critical': 2,     
        'Warning': 3   
      };
      
      const prioriteA = prioriteNiveau[a.type] || 4;
      const prioriteB = prioriteNiveau[b.type] || 4;
      
      if (prioriteA !== prioriteB) {
        return prioriteA - prioriteB; 
      }
      
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime(); 
    });
    
    return alertesTriees;
  },

  calculerStatistiques(alertes) {
    const stats = {
      total: alertes.length,
      danger: alertes.filter(a => a.type === 'Danger').length,
      critical: alertes.filter(a => a.type === 'Critical').length,
      warning: alertes.filter(a => a.type === 'Warning').length
    };
    
    return stats;
  }
};

export default alertService;
