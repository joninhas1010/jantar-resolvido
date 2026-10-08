export default function OrgBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div
        className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #FDE047 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float1 12s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[40%] -right-24 w-[300px] h-[300px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #FDE047 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float2 15s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[20%] -left-16 w-[250px] h-[250px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #FDE047 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'float3 18s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 40px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -30px) scale(1.05); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -20px) scale(1.08); }
        }
      `}</style>
    </div>
  )
}
