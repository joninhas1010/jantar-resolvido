type Props = {
  nome: string
  className?: string
}

export default function PratoPlaceholder({ nome, className = '' }: Props) {
  return (
    <div
      className={`bg-grafite flex items-center justify-center overflow-hidden ${className}`}
      style={{
        boxShadow: 'inset 0 0 40px rgba(253, 224, 71, 0.08)',
      }}
    >
      <p className="text-white/40 text-sm font-medium text-center px-4 leading-tight">{nome}</p>
    </div>
  )
}
