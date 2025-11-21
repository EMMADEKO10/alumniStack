// utils/emailTemplates.js

/**
 * Template HTML pour l'email de vérification
 * Palette LAU: Rouge (#ef4444), Bleu foncé (#1e3a8a), Cyan (#06b6d4)
 */
export const verificationEmailTemplate = (verifyUrl, firstName = '', appUrl = '') => {
  // Pour les images dans les emails, il faut des URLs absolues HTTPS
  // Si appUrl n'est pas fourni ou est en localhost, on n'affiche pas les images
  const isProduction = appUrl && appUrl.startsWith('https://');
  const logoUrl = isProduction ? `${appUrl}/lau/imgi_1_Logo%20LAU-03.png` : '';
  const facebookIcon = isProduction ? `${appUrl}/icon_reseaux_sociaux/svg/icons8-facebook.svg` : '';
  const linkedinIcon = isProduction ? `${appUrl}/icon_reseaux_sociaux/svg/icons8-linkedin.svg` : '';
  const xIcon = isProduction ? `${appUrl}/icon_reseaux_sociaux/svg/icons8-x.svg` : '';
  const instagramIcon = isProduction ? `${appUrl}/icon_reseaux_sociaux/svg/icons8-instagram.svg` : '';
  
  return `
<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Vérification de votre compte LAU Alumni</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #111827;
            background-color: #f9fafb;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
        }
        img {
            border: 0;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        .email-wrapper {
            width: 100%;
            background-color: #f9fafb;
            padding: 20px 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ef4444;
            background-image: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo-container {
            margin-bottom: 20px;
        }
        .logo-img {
            max-width: 150px;
            height: auto;
            display: inline-block;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 20px 0 10px 0;
            padding: 0;
        }
        .header p {
            color: #fee2e2;
            font-size: 16px;
            margin: 0;
            padding: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 25px;
            line-height: 1.8;
        }
        .cta-container {
            text-align: center;
            margin: 40px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #ef4444;
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .info-box {
            background-color: #ecfeff;
            border-left: 4px solid #06b6d4;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .info-box-title {
            font-weight: 600;
            color: #0e7490;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .info-box-text {
            color: #155e75;
            font-size: 14px;
            line-height: 1.6;
        }
        .features-table {
            width: 100%;
            margin: 30px 0;
        }
        .feature-row {
            margin-bottom: 15px;
        }
        .feature-icon-cell {
            width: 50px;
            vertical-align: top;
            padding-right: 15px;
        }
        .feature-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            text-align: center;
            font-size: 20px;
            line-height: 40px;
        }
        .feature-icon-red {
            background-color: #fee2e2;
            color: #ef4444;
        }
        .feature-icon-cyan {
            background-color: #cffafe;
            color: #06b6d4;
        }
        .feature-icon-blue {
            background-color: #dbeafe;
            color: #1e3a8a;
        }
        .feature-content h3 {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 5px 0;
        }
        .feature-content p {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
        }
        .footer {
            background-color: #1e3a8a;
            padding: 30px;
            text-align: center;
            color: #dbeafe;
        }
        .footer-title {
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 10px;
        }
        .footer p {
            font-size: 14px;
            margin: 5px 0;
        }
        .footer-links {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-links a {
            color: #60a5fa;
            text-decoration: none;
            margin: 0 10px;
            font-size: 13px;
        }
        .social-icons {
            margin-top: 15px;
        }
        .social-icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            margin: 0 5px;
        }
        .social-icon img {
            width: 32px;
            height: 32px;
            display: block;
        }
        .small-text {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 20px;
        }
        .link-url {
            color: #06b6d4;
            word-break: break-all;
            font-size: 13px;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
            }
            .content {
                padding: 30px 20px !important;
            }
            .header {
                padding: 30px 20px !important;
            }
            .cta-button {
                padding: 14px 30px !important;
                font-size: 15px !important;
            }
            .header h1 {
                font-size: 24px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <table role="presentation" class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 20px 10px;">
                <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- En-tête -->
                    <tr>
                        <td class="header" style="background-color: #ef4444; padding: 40px 30px; text-align: center;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" class="logo-container">
                                        ${logoUrl ? `<img src="${logoUrl}" alt="LAU Logo" class="logo-img" width="150" style="max-width: 150px; height: auto; display: block; margin: 0 auto;" />` : '<div style="width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: #ef4444; line-height: 80px;">LAU</div>'}
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 20px 0 10px 0; padding: 0;">Bienvenue dans la communauté LAU Alumni ! 🎓</h1>
                                        <p style="color: #fee2e2; font-size: 16px; margin: 0; padding: 0;">Votre voyage commence ici</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contenu principal -->
                    <tr>
                        <td class="content" style="padding: 40px 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <p class="greeting" style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px;">
                                            Bonjour${firstName ? ' ' + firstName : ''} ! 👋
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p class="message" style="font-size: 16px; color: #4b5563; margin-bottom: 25px; line-height: 1.8;">
                                            Nous sommes ravis de vous accueillir dans la <strong>Leadership Academy University Alumni Platform</strong> ! 
                                            Vous êtes sur le point de rejoindre une communauté dynamique d'anciens élèves, de professionnels 
                                            et d'innovateurs du monde entier.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p class="message" style="font-size: 16px; color: #4b5563; margin-bottom: 25px; line-height: 1.8;">
                                            Pour activer votre compte et commencer à profiter de tous nos services, veuillez cliquer sur le bouton ci-dessous :
                                        </p>
                                    </td>
                                </tr>

                                <!-- Bouton CTA -->
                                <tr>
                                    <td align="center" class="cta-container" style="padding: 20px 0;">
                                        <a href="${verifyUrl}" class="cta-button" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600;">
                                            ✓ Confirmer mon inscription
                                        </a>
                                    </td>
                                </tr>

                                <!-- Boîte d'information -->
                                <tr>
                                    <td>
                                        <table role="presentation" class="info-box" width="100%" cellpadding="20" cellspacing="0" border="0" style="background-color: #ecfeff; border-left: 4px solid #06b6d4; border-radius: 8px; margin: 30px 0;">
                                            <tr>
                                                <td>
                                                    <p class="info-box-title" style="font-weight: 600; color: #0e7490; margin: 0 0 10px 0; font-size: 16px;">
                                                        ⏰ Important
                                                    </p>
                                                    <p class="info-box-text" style="color: #155e75; font-size: 14px; line-height: 1.6; margin: 0;">
                                                        Ce lien de vérification expire dans <strong>24 heures</strong>. 
                                                        Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email en toute sécurité.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td>
                                        <div class="divider" style="height: 1px; background-color: #e5e7eb; margin: 30px 0;"></div>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center">
                                        <p style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 20px;">Ce qui vous attend :</p>
                                    </td>
                                </tr>

                                <!-- Fonctionnalités avec tableau -->
                                <tr>
                                    <td>
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                                        <tr>
                                                            <td class="feature-icon-cell" width="50" style="padding: 15px 0 15px 15px; vertical-align: top;">
                                                                <div class="feature-icon feature-icon-red" style="width: 40px; height: 40px; background-color: #fee2e2; color: #ef4444; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">👥</div>
                                                            </td>
                                                            <td class="feature-content" style="padding: 15px 15px 15px 0;">
                                                                <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 5px 0;">Réseau Professionnel</h3>
                                                                <p style="font-size: 14px; color: #6b7280; margin: 0;">Connectez-vous avec des milliers d'alumni à travers le monde</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 15px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                                        <tr>
                                                            <td class="feature-icon-cell" width="50" style="padding: 15px 0 15px 15px; vertical-align: top;">
                                                                <div class="feature-icon feature-icon-cyan" style="width: 40px; height: 40px; background-color: #cffafe; color: #06b6d4; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">💼</div>
                                                            </td>
                                                            <td class="feature-content" style="padding: 15px 15px 15px 0;">
                                                                <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 5px 0;">Opportunités Exclusives</h3>
                                                                <p style="font-size: 14px; color: #6b7280; margin: 0;">Accédez à des offres d'emploi, stages et événements réservés aux membres</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                                        <tr>
                                                            <td class="feature-icon-cell" width="50" style="padding: 15px 0 15px 15px; vertical-align: top;">
                                                                <div class="feature-icon feature-icon-blue" style="width: 40px; height: 40px; background-color: #dbeafe; color: #1e3a8a; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">📚</div>
                                                            </td>
                                                            <td class="feature-content" style="padding: 15px 15px 15px 0;">
                                                                <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 5px 0;">Formation Continue</h3>
                                                                <p style="font-size: 14px; color: #6b7280; margin: 0;">Développez vos compétences avec nos programmes de formation</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td>
                                        <div class="divider" style="height: 1px; background-color: #e5e7eb; margin: 30px 0;"></div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
                                            <strong>Le lien ne fonctionne pas ?</strong><br>
                                            Copiez et collez cette URL dans votre navigateur :<br>
                                            <a href="${verifyUrl}" class="link-url" style="color: #06b6d4; word-break: break-all; font-size: 13px;">${verifyUrl}</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Pied de page -->
                    <tr>
                        <td class="footer" style="background-color: #1e3a8a; padding: 30px; text-align: center; color: #dbeafe;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p class="footer-title" style="font-size: 18px; font-weight: 600; color: #ffffff; margin: 0 0 10px 0;">LAU Alumni Platform</p>
                                        <p style="font-size: 14px; margin: 5px 0; color: #dbeafe;">Excellence • Innovation • Communauté</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                                        <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px; font-size: 13px;">À propos</a>
                                        <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px; font-size: 13px;">Contact</a>
                                        <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px; font-size: 13px;">Aide</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" class="social-icons" style="padding-top: 15px;">
                                        ${isProduction ? `
                                        <a href="#" class="social-icon" style="display: inline-block; margin: 0 5px;"><img src="${facebookIcon}" alt="Facebook" width="32" height="32" style="width: 32px; height: 32px; display: block;" /></a>
                                        <a href="#" class="social-icon" style="display: inline-block; margin: 0 5px;"><img src="${linkedinIcon}" alt="LinkedIn" width="32" height="32" style="width: 32px; height: 32px; display: block;" /></a>
                                        <a href="#" class="social-icon" style="display: inline-block; margin: 0 5px;"><img src="${xIcon}" alt="X" width="32" height="32" style="width: 32px; height: 32px; display: block;" /></a>
                                        <a href="#" class="social-icon" style="display: inline-block; margin: 0 5px;"><img src="${instagramIcon}" alt="Instagram" width="32" height="32" style="width: 32px; height: 32px; display: block;" /></a>
                                        ` : `
                                        <div style="font-size: 24px; letter-spacing: 10px;">
                                            📘 💼 ✖️ 📸
                                        </div>
                                        `}
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <p class="small-text" style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                                            © 2025 Leadership Academy University. Tous droits réservés.<br>
                                            Vous recevez cet email car vous vous êtes inscrit sur LAU Alumni Platform.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};

/**
 * Template texte brut pour l'email de vérification (fallback)
 */
export const verificationEmailText = (verifyUrl, firstName = '') => {
  return `
Bonjour${firstName ? ' ' + firstName : ''} !

Bienvenue dans la communauté LAU Alumni !

Nous sommes ravis de vous accueillir dans la Leadership Academy University Alumni Platform.

Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :

${verifyUrl}

Ce lien expire dans 24 heures.

Ce qui vous attend :
- Réseau professionnel avec des milliers d'alumni
- Opportunités exclusives (emplois, stages, événements)
- Formation continue pour développer vos compétences

Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.

Cordialement,
L'équipe LAU Alumni Platform

---
© 2025 Leadership Academy University. Tous droits réservés.
`;
};

/**
 * Template pour l'email de réinitialisation de mot de passe
 */
export const resetPasswordEmailTemplate = (resetUrl, firstName = '') => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #111827;
            background-color: #f9fafb;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo-circle {
            width: 80px;
            height: 80px;
            background-color: #ffffff;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .logo-text {
            font-size: 28px;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: 1px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .header p { color: #dbeafe; font-size: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
        .message { font-size: 16px; color: #4b5563; margin-bottom: 25px; line-height: 1.8; }
        .cta-container { text-align: center; margin: 35px 0; }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .warning-box {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .warning-box-title { font-weight: 600; color: #991b1b; margin-bottom: 10px; }
        .warning-box-text { color: #7f1d1d; font-size: 14px; line-height: 1.6; }
        .footer {
            background-color: #1e3a8a;
            padding: 30px;
            text-align: center;
            color: #dbeafe;
        }
        .footer p { font-size: 14px; }
        .small-text { font-size: 12px; color: #9ca3af; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-circle">
                <div class="logo-text">LAU</div>
            </div>
            <h1>Réinitialisation de mot de passe 🔐</h1>
            <p>Sécurisez votre compte</p>
        </div>
        <div class="content">
            <div class="greeting">Bonjour${firstName ? ' ' + firstName : ''} !</div>
            <div class="message">
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte LAU Alumni Platform.
            </div>
            <div class="cta-container">
                <a href="${resetUrl}" class="cta-button">Réinitialiser mon mot de passe</a>
            </div>
            <div class="warning-box">
                <div class="warning-box-title">⚠️ Sécurité</div>
                <div class="warning-box-text">
                    Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, 
                    veuillez ignorer cet email et votre mot de passe restera inchangé.
                </div>
            </div>
            <div class="message">
                <strong>Le lien ne fonctionne pas ?</strong><br>
                Copiez cette URL : <a href="${resetUrl}" style="color: #06b6d4; word-break: break-all; font-size: 13px;">${resetUrl}</a>
            </div>
        </div>
        <div class="footer">
            <p>LAU Alumni Platform - Excellence • Innovation • Communauté</p>
            <p class="small-text">© 2025 Leadership Academy University. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
`;
};
