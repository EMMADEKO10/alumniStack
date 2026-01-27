/**
 * Système de cache simple en mémoire pour réduire les appels à la base de données
 * Compatible avec l'hébergement Hostinger
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes par défaut
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Récupérer une valeur du cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Vérifier si l'entrée est expirée
    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Stocker une valeur dans le cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Nettoyer automatiquement après le TTL
    if (ttl) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
    }
  }

  /**
   * Supprimer une entrée du cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Supprimer toutes les entrées correspondant à un préfixe
   */
  deleteByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Vider tout le cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtenir la taille du cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Nettoyer les entrées expirées
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultTTL) {
        this.cache.delete(key);
      }
    }
  }
}

// Instance globale du cache
const globalCache = new MemoryCache();

// Nettoyer le cache toutes les 10 minutes
setInterval(() => {
  globalCache.cleanup();
  console.log(`🧹 Cache nettoyé. Entrées restantes: ${globalCache.size()}`);
}, 10 * 60 * 1000);

/**
 * Fonction helper pour utiliser le cache avec une fonction async
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Vérifier le cache
  const cached = globalCache.get<T>(key);
  if (cached !== null) {
    console.log(`✅ Cache hit: ${key}`);
    return cached;
  }

  // Récupérer les données
  console.log(`🔄 Cache miss: ${key}, fetching...`);
  const data = await fetcher();
  
  // Stocker dans le cache
  globalCache.set(key, data, ttl);
  
  return data;
}

export default globalCache;
