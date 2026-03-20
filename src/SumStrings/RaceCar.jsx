const COLORS = ['#E02020', '#FF8C00', '#1A8CFF', '#22BB55', '#9933FF', '#FF3399']

export default function RaceCar({ colorIndex = 0, onDone }) {
  const color = COLORS[colorIndex % COLORS.length]

  return (
    <div
      className="fixed left-0 right-0 bottom-0 overflow-hidden pointer-events-none"
      style={{ height: 90, zIndex: 2 }}
    >
      <div
        onAnimationEnd={onDone}
        style={{
          position: 'absolute',
          bottom: 6,
          display: 'flex',
          alignItems: 'center',
          animation: 'race-drive 2.2s linear forwards',
        }}
      >
        {/* Speed lines trailing to the left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginRight: 8 }}>
          <div style={{ width: 50, height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.55 }} />
          <div style={{ width: 32, height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.35 }} />
          <div style={{ width: 44, height: 3, backgroundColor: color, borderRadius: 2, opacity: 0.55 }} />
        </div>

        {/* Car */}
        <svg
          viewBox="55 128 308 138"
          width={154}
          height={69}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M69.5275 238.001C-9.47449 214.379 109.671 181.471 145.868 181.471" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M148.557 196.945C209.808 185.466 295.226 167.576 353.277 198.843C355.344 199.96 366.639 232.606 326.512 232.606" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M132.369 239.351C176.122 243.588 221.927 247.583 265.924 242.016" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M278.649 226.177C296.83 172.527 348.636 256.888 294.608 256.888C281.742 256.888 278.93 248.28 275.367 237.517" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M81.5716 234.895C93.1218 194.364 155.508 218.441 111.39 253.413C107.888 256.19 94.8828 260.122 90.8894 257.214C83.0322 251.497 81.1055 241.245 81.1055 232.044" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M170.718 147.096C190.27 132.502 199.82 146.9 196.541 161.104C193.032 176.304 175.62 191.364 165.033 173.047C160.817 165.762 161.721 156.054 164.158 148.827" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M207.915 157.059C214.26 164.764 221.607 170.144 228.151 177.295" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <path opacity="0.5" d="M164.746 209.672C227.059 206.384 290.355 202.927 353.612 202.927" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}
