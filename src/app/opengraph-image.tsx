import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Leadership Academy Alumni Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          color: 'white',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Leadership Academy
          </h1>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: '600',
              marginBottom: '40px',
              opacity: 0.95,
            }}
          >
            Alumni Platform
          </h2>
          <p
            style={{
              fontSize: '28px',
              opacity: 0.9,
              maxWidth: '800px',
              lineHeight: 1.5,
            }}
          >
            Connectez-vous avec des milliers d&apos;alumni, découvrez des opportunités et contribuez au développement de notre communauté
          </p>
          <div
            style={{
              marginTop: '40px',
              fontSize: '24px',
              opacity: 0.8,
            }}
          >
            alumni-launiversity.cd
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
