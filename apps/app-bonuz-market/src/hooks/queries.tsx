
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { BACKEND_ENDPOINT } from '../lib/services';
import { useSessionStore } from '../store/sessionStore';
import { Apps, Partners } from '@/types';


export const useQueryPartners = () => {
  const queryKey = ['getUserPartnersNew'];
  const queryFn = async () => {
    const { token } = useSessionStore.getState();

    const res = await axios.get<Partners>(`${BACKEND_ENDPOINT}/api/partners/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  return useQuery(queryKey, queryFn, {
    enabled: true,
  });
};

// ------------------------------


export const useQueryApps = () => {
  const queryKey = ['getUserAppsNew'];
  const queryFn = async () => {
    const { token } = useSessionStore.getState();

    const res = await axios.get<Apps>(`${BACKEND_ENDPOINT}/api/apps/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data ?? [];
  };

  return useQuery(queryKey, queryFn, {
    enabled: true,
  });
};
// ------------------------------
export const useQueryCheckInMemberships = (partnerId: number) => {
  const queryKey = ['getCheckInMemberships'];
  const queryFn = async () => {
    const { token } = useSessionStore.getState();

    const res = await axios.get(
      `${BACKEND_ENDPOINT}/api/partners/${partnerId}/memberships`,
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

// ------------------------------
export const useQueryCheckInVouchers = (partnerId: number) => {
  const queryKey = ['getCheckInVouchers'];
  const queryFn = async () => {
    const { token } = useSessionStore.getState();

    const res = await axios.get(
      `${BACKEND_ENDPOINT}/api/partners/${partnerId}/vouchers`,
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

// -------------------------------------
export const useQueryDefaultChallenges = () => {
  const queryKey = ['defaultChallenges'];
  const queryFn = async () => {
    const { token } = useSessionStore.getState();

    const res = await axios.get(`${BACKEND_ENDPOINT}/api/defaultChallenges/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  return useQuery(queryKey, queryFn, {
    enabled: true,
  });
};
