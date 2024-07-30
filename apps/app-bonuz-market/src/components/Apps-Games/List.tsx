import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import clsxm from '../../lib/frontend/clsxm'
import { BACKEND_ENDPOINT } from '../../lib/services'
import { useSessionStore } from '../../store/sessionStore'
import { useRouter } from 'next/navigation'
import { Apps, NewPartnerStatus } from '@/types'
import Link from 'next/link'
import Card from '../Card'

interface Props {
  data: Apps | undefined
}

const ListPartnerApps = ({ data = [] }: Props) => {
  const router = useRouter()

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      {data?.map((app, index) => (
        <Link href={`/apps-games/${app.id}`} key={index}>
          <Card title={app.name} backgroundImage={app.image.url} />
        </Link>
      ))}

      <div
        className={clsxm(
          'flex items-center justify-center self-start  rounded-2xl bg-cover bg-center bg-no-repeat text-2xl font-bold text-white'
        )}
        style={{
          height: '250px',
          backgroundImage: 'url(/images/card.png)',
        }}
        role='button'
        tabIndex={0}
        onClick={() => {
          router.push(`/apps-games/create-app`)
        }}>
        + Create New
      </div>
    </div>
  )
}

export default ListPartnerApps
