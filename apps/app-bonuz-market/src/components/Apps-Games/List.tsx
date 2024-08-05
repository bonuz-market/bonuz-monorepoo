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

export const useQueryPartnerApps = (partnerId: number) => {
  const queryKey = ['getUserPartnersApps', partnerId]
  const queryFn = async () => {
    const { token } = useSessionStore.getState()

    const res = await axios.get<Apps>(
      `${BACKEND_ENDPOINT}/api/partners/${partnerId}/apps`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  }

  return useQuery(queryKey, queryFn, {
    enabled: !!partnerId,
  })
}

const ListPartnerApps = ({ partner }: { partner: any }) => {
  const router = useRouter()

  const { data } = useQueryPartnerApps(partner?.id)
 console.log("data ", data);

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      {data?.map((app, index) => (
        <Link href={`/partners/${partner.id}/apps-games/${app.id}`} key={index}>
          <Card title={app.name} backgroundImage={app.image.url} />
        </Link>
      ))}

      {partner?.status === NewPartnerStatus.ACTIVE && (
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
            router.push(`/partners/${partner.id}/apps-games/create-app`);
          }}>
          + Create New
        </div>
      )}
    </div>
  )
}

export default ListPartnerApps
