import filtreService from "./filterService";

/**
 * Recherche client-side dans la liste de salles retournée par /filter
 * @param {string} term - texte saisi dans la barre de recherche
 * @param {Object=} opts - mêmes options que filtreService.getSallesSQL
 */
const searchService = {
  async searchSalles(term, opts = {}) {
    const resp = await filtreService.getSallesSQL(opts);
    const list = resp?.data ?? resp ?? [];
    const t = (term || "").toString().toLowerCase().trim();
    if (!t) return list;

    const match = (s) => {
      const nom = (s.nom || "").toLowerCase();
      const bat = (s.batiment || "").toLowerCase();
      const etg = String(s.etage ?? "").toLowerCase();
      const cap = String(s.capacite ?? "").toLowerCase();
      return nom.includes(t) || bat.includes(t) || etg.includes(t) || cap.includes(t);
    };

    return Array.isArray(list) ? list.filter(match) : list;
  },
};

export default searchService;
