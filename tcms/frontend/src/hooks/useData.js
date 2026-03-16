import { useCallback, useEffect, useState } from 'react';
import { DEMO_MODE } from '../constants/index.js';
import * as mock     from '../mock/handlers.js';
import * as casesApi from '../api/cases.api.js';
import * as usersApi from '../api/user.api.js';
import * as stagesApi from '../api/stages.api.js';
import { useToast }  from '../context/TostContext.jsx';

export function useData(user) {
  const toast = useToast();

  const [cases,  setCases]  = useState([]);
  const [users,  setUsers]  = useState([]);
  const [stages, setStages] = useState([]);
  const [stats,  setStats]  = useState(null);
  const [busy,   setBusy]   = useState(false);

  /* ── load all data ────────────────────────────── */
  const load = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    try {
      if (DEMO_MODE) {
        const cRes = mock.getCases(user);
        const uRes = mock.getUsers();
        const sRes = mock.getStages();
        const stRes = mock.getStats(user);
        setCases(cRes.cases);
        setUsers(uRes.users);
        setStages(sRes.stages);
        setStats(stRes);
      } else {
        const [cRes, uRes, sRes, stRes] = await Promise.all([
          casesApi.list(),
          usersApi.list(),
          stagesApi.list(),
          casesApi.summary(),
        ]);
        setCases(cRes.cases   || []);
        setUsers(uRes.users   || []);
        setStages(sRes.stages || []);
        setStats(stRes);
      }
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  /* ── case operations ────────────────────────── */
  const getCase = useCallback(async (id) => {
    if (DEMO_MODE) return mock.getCaseById(id, user);
    return casesApi.getById(id);
  }, [user]);

  const createCase = useCallback(async (data) => {
    const res = DEMO_MODE ? mock.createCase(data, user.id) : await casesApi.create(data);
    await load();
    return res;
  }, [load, user]);

  const updateCase = useCallback(async (id, data) => {
    const res = DEMO_MODE ? mock.updateCase(id, data, user) : await casesApi.update(id, data);
    await load();
    return res;
  }, [load, user]);

  const assignCase = useCallback(async (id, userId) => {
    const res = DEMO_MODE ? mock.assignCase(id, userId, user.id) : await casesApi.assign(id, userId);
    await load();
    return res;
  }, [load, user]);

  const flagCase = useCallback(async (id, reason, remarks) => {
    const res = DEMO_MODE ? mock.flagCase(id, reason, remarks, user.id) : await casesApi.flag(id, reason, remarks);
    await load();
    return res;
  }, [load, user]);

  const unflagCase = useCallback(async (id) => {
    const res = DEMO_MODE ? mock.unflagCase(id, user.id) : await casesApi.unflag(id);
    await load();
    return res;
  }, [load, user]);

  /* ── user operations ────────────────────────── */
  const createUser = useCallback(async (data) => {
    const res = DEMO_MODE ? mock.createUser(data) : await usersApi.create(data);
    await load();
    return res;
  }, [load]);

  const updateUser = useCallback(async (id, data) => {
    const res = DEMO_MODE ? mock.updateUser(id, data) : await usersApi.update(id, data);
    await load();
    return res;
  }, [load]);

  /* ── stage operations ───────────────────────── */
  const createStage = useCallback(async (data) => {
    const res = DEMO_MODE ? mock.createStage(data) : await stagesApi.create(data);
    await load();
    return res;
  }, [load]);

  const updateStage = useCallback(async (id, data) => {
    const res = DEMO_MODE ? mock.updateStage(id, data) : await stagesApi.update(id, data);
    await load();
    return res;
  }, [load]);

  const deleteStage = useCallback(async (id) => {
    const res = DEMO_MODE ? mock.deactivateStage(id) : await stagesApi.deactivate(id);
    await load();
    return res;
  }, [load]);

  /* ── full audit history ─────────────────────── */
  const getFullHistory = useCallback(async () => {
    if (DEMO_MODE) return mock.getFullHistory();
    const res = await casesApi.fullHistory();
    return res.history || [];
  }, []);

  return {
    cases, users, stages, stats, busy, reload: load,
    getCase, createCase, updateCase, assignCase, flagCase, unflagCase,
    createUser, updateUser,
    createStage, updateStage, deleteStage,
    getFullHistory,
  };
}