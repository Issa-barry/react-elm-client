import { useCallback, useState } from 'react';
import { livraisonService } from '../services/livraison.service';
import type { Transfert } from '../types/transfert.types';

export function useTransfertDetail(id: string) {
  const [transfert, setTransfert] = useState<Transfert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await livraisonService.getTransfertDetail(id);
    if (result.ok) {
      setTransfert(result.data as Transfert);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [id]);

  const reload = load;

  return { transfert, loading, error, load, reload };
}
