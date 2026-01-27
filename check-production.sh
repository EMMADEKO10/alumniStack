#!/bin/bash

# Script de vérification de la configuration production
# Exécuter ce script sur le serveur Hostinger après déploiement

echo "🔍 Vérification de la configuration production..."
echo ""

# Vérifier les variables d'environnement critiques
check_env() {
  if [ -z "${!1}" ]; then
    echo "❌ $1: MANQUANTE"
    return 1
  else
    echo "✅ $1: Définie"
    return 0
  fi
}

ERRORS=0

echo "📋 Variables d'environnement:"
check_env "MONGODB_URI" || ((ERRORS++))
check_env "NEXTAUTH_SECRET" || ((ERRORS++))
check_env "NEXTAUTH_URL" || ((ERRORS++))
check_env "NEXT_PUBLIC_APP_URL" || ((ERRORS++))

echo ""
echo "🔗 Test des endpoints API:"

# Tester la route de santé
echo -n "  /api/health: "
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://alumni-launiversity.cd/api/health)
if [ "$HEALTH_STATUS" = "200" ]; then
  echo "✅ OK ($HEALTH_STATUS)"
else
  echo "❌ Erreur ($HEALTH_STATUS)"
  ((ERRORS++))
fi

# Tester la route events
echo -n "  /api/events: "
EVENTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://alumni-launiversity.cd/api/events)
if [ "$EVENTS_STATUS" = "200" ]; then
  echo "✅ OK ($EVENTS_STATUS)"
else
  echo "❌ Erreur ($EVENTS_STATUS)"
  ((ERRORS++))
fi

# Tester la route opportunities
echo -n "  /api/opportunities: "
OPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://alumni-launiversity.cd/api/opportunities)
if [ "$OPP_STATUS" = "200" ]; then
  echo "✅ OK ($OPP_STATUS)"
else
  echo "❌ Erreur ($OPP_STATUS)"
  ((ERRORS++))
fi

echo ""
echo "📊 Initialisation des index MongoDB:"
npm run db:init

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ Configuration production OK!"
  exit 0
else
  echo "⚠️ $ERRORS erreur(s) détectée(s)"
  echo "Consultez le guide PRODUCTION_SETUP.md pour résoudre les problèmes"
  exit 1
fi
