
import loadingImage from '/logo.png';

export default function LoadingGif({size = 100}) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-40 h-40">
        {/* First cutting line - clockwise - black-blue */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '7px solid transparent',
            borderTopColor: '#1e3a8a',
            borderRightColor: '#1e3a8a',
            animation: 'spin 2s linear infinite',
          }}
        ></div>

        {/* Second cutting line - counter-clockwise - blue */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '7px solid transparent',
            borderBottomColor: '#3b82f6',
            transform: 'rotate(120deg)',
            animation: 'spinReverse 2.5s linear infinite',
          }}
        ></div>

        {/* Third cutting line - clockwise - gray */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '7px solid transparent',
            borderLeftColor: '#6b7280',
            transform: 'rotate(240deg)',
            animation: 'spin 3s linear infinite',
          }}
        ></div>

        {/* Centered stable logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={loadingImage}
            alt="Loading..."
            className="w-32 h-32"
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          from {
            transform: rotate(120deg);
          }
          to {
            transform: rotate(-240deg);
          }
        }
      `}</style>
    </div>
  );
}
