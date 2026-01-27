import { NextResponse } from 'next/server';
import { connectDB } from './mongodb';
import { withCache } from './cache';

/**
 * Options pour les requêtes optimisées
 */
interface QueryOptions {
  cache?: boolean;
  cacheTTL?: number;
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: Record<string, 1 | -1>;
  select?: Record<string, 1 | 0>;
}

/**
 * Wrapper pour les routes API avec optimisations automatiques
 */
export async function optimizedQuery<T>(
  collection: string,
  query: Record<string, unknown>,
  options: QueryOptions = {}
): Promise<T[]> {
  const {
    cache = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutes par défaut
    pagination,
    sort = { createdAt: -1 },
    select,
  } = options;

  // Générer une clé de cache unique
  const cacheKey = `query:${collection}:${JSON.stringify({ query, pagination, sort, select })}`;

  const fetcher = async () => {
    const { db } = await connectDB();
    const col = db.collection(collection);

    let cursor = col.find(query);

    // Appliquer le tri
    if (sort) {
      cursor = cursor.sort(sort);
    }

    // Appliquer la sélection de champs
    if (select) {
      cursor = cursor.project(select);
    }

    // Appliquer la pagination
    if (pagination) {
      const { page, limit } = pagination;
      cursor = cursor.skip((page - 1) * limit).limit(limit);
    }

    return await cursor.toArray() as T[];
  };

  if (cache) {
    return withCache(cacheKey, fetcher, cacheTTL);
  }

  return fetcher();
}

/**
 * Compter les documents avec cache
 */
export async function optimizedCount(
  collection: string,
  query: Record<string, unknown> = {},
  useCache: boolean = true
): Promise<number> {
  const cacheKey = `count:${collection}:${JSON.stringify(query)}`;

  const fetcher = async () => {
    const { db } = await connectDB();
    return await db.collection(collection).countDocuments(query);
  };

  if (useCache) {
    return withCache(cacheKey, fetcher, 5 * 60 * 1000);
  }

  return fetcher();
}

/**
 * Récupérer un seul document avec cache
 */
export async function optimizedFindOne<T>(
  collection: string,
  query: Record<string, unknown>,
  useCache: boolean = true
): Promise<T | null> {
  const cacheKey = `findOne:${collection}:${JSON.stringify(query)}`;

  const fetcher = async () => {
    const { db } = await connectDB();
    return await db.collection(collection).findOne(query) as T | null;
  };

  if (useCache) {
    return withCache(cacheKey, fetcher, 5 * 60 * 1000);
  }

  return fetcher();
}

/**
 * Wrapper pour les handlers API avec gestion d'erreurs
 */
export function apiHandler<T = NextResponse>(
  handler: (request: Request, context?: Record<string, unknown>) => Promise<T>
) {
  return async (request: Request, context?: Record<string, unknown>) => {
    try {
      const result = await handler(request, context);
      return result;
    } catch (error) {
      console.error('❌ Erreur API:', error);
      
      if (error instanceof Error) {
        return NextResponse.json(
          { 
            success: false, 
            error: error.message,
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Une erreur interne est survenue',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper pour invalider le cache après une mutation
 */
export async function invalidateCache(patterns: string[]) {
  const { invalidateCacheByPrefix } = await import('./cache');
  patterns.forEach(pattern => {
    invalidateCacheByPrefix(pattern);
  });
}
