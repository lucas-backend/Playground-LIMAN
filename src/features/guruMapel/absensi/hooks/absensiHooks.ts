import { useCallback, useEffect, useState } from 'react';

import { getKelasList, getPertemuanDetail, getPertemuanList } from './api/absensiApi';
import type { Kelas, PertemuanDetail } from './model/absensi';

export type KelasListState = { status: 'loading' } | { status: 'ready'; data: Kelas[] } | { status: 'error' };

export type PertemuanListState = { status: 'loading' } | { status: 'ready'; data: Pertemuan[] } | { status: 'error' };

export type PertemuanDetailState = { status: 'loading' } | { status: 'ready'; data: PertemuanDetail } | { status: 'notfound'; data: null } | { status: 'error' };

export function useAbsensiKelas(kelasId: string | undefined) {
  const [state, setState] = useState<KelasListState>({ status: 'loading' });

  const fetchKelas = useCallback(async () => {
    try {
      const data = await getKelasList();
      setState({ status: 'ready', data });
    } catch {
      setState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    fetchKelas();
  }, [fetchKelas]);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    fetchKelas();
  }, [fetchKelas]);

  return { state, reload };
}

export function useAbsensiPertemuan(kelasId: string, pertemuanId: string | undefined) {
  const [state, setState] = useState<PertemuanListState>({ status: 'loading' });
  const [detailState, setDetailState] = useState<PertemuanDetailState>({ status: 'loading' });

  const fetchList = useCallback(async () => {
    try {
      const data = await getPertemuanList(Number(kelasId));
      setState({ status: 'ready', data });
    } catch {
      setState({ status: 'error' });
    }
  }, [kelasId]);

  const fetchDetail = useCallback(async () => {
    if (!pertemuanId) return;
    try {
      const data = await getPertemuanDetail(Number(kelasId), Number(pertemuanId));
      if (data) {
        setDetailState({ status: 'ready', data });
      } else {
        setDetailState({ status: 'notfound', data: null });
      }
    } catch {
      setDetailState({ status: 'error' });
    }
  }, [kelasId, pertemuanId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const reloadList = useCallback(() => {
    setState({ status: 'loading' });
    fetchList();
  }, [fetchList]);

  const reloadDetail = useCallback(() => {
    setDetailState({ status: 'loading' });
    fetchDetail();
  }, [fetchDetail]);

  return { listState: state, detailState, reloadList, reloadDetail };
}

export function useDetailSiswa(siswaId: string | undefined) {
  const [state, setState] = useState<{ status: 'loading' } | { status: 'ready'; data: any } | { status: 'error' }>({ status: 'loading' });

  const fetch = useCallback(async () => {
    if (!siswaId) return;
    try {
      const data = await getDetailSiswa(siswaId);
      setState({ status: 'ready', data });
    } catch {
      setState({ status: 'error' });
    }
  }, [siswaId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    fetch();
  }, [fetch]);

  return { state, reload };
}
