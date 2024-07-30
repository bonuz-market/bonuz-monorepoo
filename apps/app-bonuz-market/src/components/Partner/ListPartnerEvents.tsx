import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import clsxm from '../../lib/frontend/clsxm';
import { BACKEND_ENDPOINT } from '../../lib/services';
import { useSessionStore } from '../../store/sessionStore';
import { useRouter } from 'next/navigation';
import { NewPartnerStatus } from '@/types';
import Link from 'next/link';
import PartnerCard from './PartnerCard';

export const useQueryPartnerEvents = (partnerId: number) => {
  const queryKey = ['getUserPartnersEvents'];
  const queryFn = async () => {
    const { token } = useSessionStore.getState();

    const res = await axios.get(
      `${BACKEND_ENDPOINT}/api/partners/${partnerId}/events`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  };

  return useQuery(queryKey, queryFn, {
    enabled: !!partnerId,
  });
};

const ListPartnerEvents = ({ partner }: { partner: any }) => {
  const router = useRouter()

  const { data } = useQueryPartnerEvents(partner?.id);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {data?.map((event: any, index: number) => (
        <Link href={`/partners/${partner.id}/events/${event.id}`} key={index}>
          <PartnerCard
            partner={{
              id: event.id,
              title: event.title,
              link: event.link,
              partnerStatus: event.status,
              image: event.image,
            }}
          />
        </Link>
      ))}

      {partner.status === NewPartnerStatus.ACTIVE && (
        <div
          className={clsxm(
            'flex items-center justify-center self-start  rounded-2xl bg-cover bg-center bg-no-repeat text-2xl font-bold text-white',
          )}
          style={{
            height: '250px',
            backgroundImage: 'url(/images/card.png)',
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            router.push(`/partners/${partner.id}/events/create-event`);
          }}
        >
          + Create New
        </div>
      )}
    </div>
  );
};

export default ListPartnerEvents;
