// Facts:
// 1. Imported by [slug]/page.tsx for slug 'our-team'.
// 2. Glob: src/components/sections/TeamGrid.tsx returned No files found.
// 3. No I/O. Server component; takes Payload team docs as a prop.
//    Doc shape: { id, name, slug, role, category, photo: {url, alt} }.
// 4. User: "wire up sections on the pages and create components".

interface MediaDoc {
  url?: string | null
  alt?: string | null
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  role?: string | null
  category?: string | null
  photo?: MediaDoc | string | null
  order?: number | null
}

interface TeamGridProps {
  team: TeamMember[]
  eyebrowNumber?: string
  heading?: string
  italicSuffix?: string
  description?: string
}

function mediaUrl(m: MediaDoc | string | null | undefined): string | null {
  if (!m || typeof m === 'string') return null
  return m.url ?? null
}

function mediaAlt(
  m: MediaDoc | string | null | undefined,
  fallback: string,
): string {
  if (!m || typeof m === 'string') return fallback
  return m.alt ?? fallback
}

function AttorneyCard({ member }: { member: TeamMember }) {
  const url = mediaUrl(member.photo)
  const alt = mediaAlt(member.photo, member.name)
  return (
    <a
      href={`/team/${member.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          aspectRatio: '4/5',
          background: 'var(--cream-2)',
          marginBottom: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'repeating-linear-gradient(135deg, var(--cream-2) 0 12px, var(--cream-3, var(--cream-2)) 12px 24px)',
            }}
          />
        )}
      </div>
      {member.category && (
        <div
          className="eyebrow"
          style={{ color: 'var(--accent)', marginBottom: 6 }}
        >
          {member.category}
        </div>
      )}
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          margin: 0,
          marginBottom: 4,
        }}
      >
        {member.name}
      </h3>
      {member.role && (
        <div
          className="body-sm"
          style={{
            color: 'var(--ink-3)',
            fontStyle: 'italic',
            fontFamily: 'var(--serif)',
          }}
        >
          {member.role}
        </div>
      )}
    </a>
  )
}

export function TeamGrid({
  team,
  eyebrowNumber = '06',
  heading = 'Our',
  italicSuffix = 'Attorneys.',
  description,
}: TeamGridProps) {
  return (
    <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
      <div className="container-wide">
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 64,
            paddingBottom: 24,
            borderBottom: '1px solid var(--line)',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              <span style={{ color: 'var(--accent)', marginRight: 10 }}>
                {eyebrowNumber}
              </span>{' '}
              The Team
            </div>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(40px, 5vw, 80px)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {heading}{' '}
              <span
                className="display-italic"
                style={{ color: 'var(--teal-800)' }}
              >
                {italicSuffix}
              </span>
            </h2>
          </div>
          {description && (
            <p
              className="body-lg"
              style={{
                maxWidth: 420,
                color: 'var(--ink-2)',
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {team.length === 0 ? (
          <p className="body-lg" style={{ color: 'var(--ink-3)' }}>
            Team profiles are being prepared. Check back soon.
          </p>
        ) : (
          <div
            className="grid-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 48,
            }}
          >
            {team.map((m) => (
              <AttorneyCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
