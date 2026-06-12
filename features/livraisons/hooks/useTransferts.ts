import { useCallback, useState } from 'react';
import { livraisonService } from '../services/livraison.service';
import type { Transfert } from '../types/transfert.types';

export function useTransferts(tab: 'en_cours' | 'historique' = 'en_cours') {
  const [transferts, setTransferts] = useState<Transfert[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await livraisonService.getTransferts(tab);
    if (result.ok) {
      setTransferts(result.data as Transfert[]);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [tab]);

  const refetch = useCallback(async () => {
    setRefreshing(true);
    const result = await livraisonService.getTransferts(tab);
    if (result.ok) {
      setTransferts(result.data as Transfert[]);
      setError(null);
    } else {
      setError(result.error);
    }
    setRefreshing(false);
  }, [tab]);

  return { transferts, loading, refreshing, error, load, refetch };
}
