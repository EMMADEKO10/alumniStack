/**
 * Utilitaire pour gérer les images Cloudinary avec des transformations optimisées
 */

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  crop?: 'fill' | 'scale' | 'fit' | 'crop' | 'thumb';
  gravity?: 'center' | 'face' | 'faces' | 'auto';
}

/**
 * Génère une URL Cloudinary optimisée
 * @param publicId - L'ID public de l'image sur Cloudinary
 * @param options - Options de transformation
 * @returns URL Cloudinary transformée
 */
export function getCloudinaryUrl(publicId: string, options: CloudinaryOptions = {}): string {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'center'
  } = options;

  const transformations = [
    `c_${crop}`,
    `w_${width}`,
    `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    `g_${gravity}`
  ].join(',');

  return `https://res.cloudinary.com/dzhpaf2vw/image/upload/${transformations}/${publicId}`;
}

/**
 * URLs d'images par défaut pour différents contextes
 */
export const defaultImages = {
  // Formations
  uxDesign: "v1747579799/_21bd88b7-e386-45d7-9db3-7ba43b135625_iokqbi",
  webDevelopment: "v1747579800/web-development-course_abc123",
  digitalMarketing: "v1747579801/digital-marketing-course_def456",
  
  // Événements
  conference: "v1747579802/conference-innovation_ghi789",
  networking: "v1747579803/networking-alumni_jkl012",
  workshop: "v1747579804/workshop-leadership_mno345",
  
  // Opportunités
  techJob: "v1747579805/tech-job-opportunity_pqr678",
  marketingJob: "v1747579806/marketing-job_stu901",
  financeJob: "v1747579807/finance-job_vwx234",
  
  // Par défaut
  placeholder: "v1747579808/placeholder-image_yz567"
};

/**
 * Génère une URL d'image optimisée pour les cartes
 * @param imageKey - Clé de l'image dans defaultImages
 * @returns URL Cloudinary optimisée pour les cartes
 */
export function getCardImage(imageKey: keyof typeof defaultImages): string {
  return getCloudinaryUrl(defaultImages[imageKey], {
    width: 400,
    height: 300,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  });
}

/**
 * Génère une URL d'image optimisée pour les pages de détails
 * @param imageKey - Clé de l'image dans defaultImages
 * @returns URL Cloudinary optimisée pour les détails
 */
export function getDetailImage(imageKey: keyof typeof defaultImages): string {
  return getCloudinaryUrl(defaultImages[imageKey], {
    width: 1200,
    height: 800,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  });
}

/**
 * Génère une URL d'image responsive avec plusieurs tailles
 * @param imageKey - Clé de l'image dans defaultImages
 * @returns Objet avec différentes tailles d'images
 */
export function getResponsiveImages(imageKey: keyof typeof defaultImages) {
  const baseId = defaultImages[imageKey];
  
  return {
    small: getCloudinaryUrl(baseId, { width: 400, height: 300 }),
    medium: getCloudinaryUrl(baseId, { width: 800, height: 600 }),
    large: getCloudinaryUrl(baseId, { width: 1200, height: 800 }),
    xlarge: getCloudinaryUrl(baseId, { width: 1600, height: 1200 })
  };
} 
