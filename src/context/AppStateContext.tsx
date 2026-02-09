import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { detectDeviceType } from "@/lib/deviceDetection";
import {
  fetchProgress,
  saveProgress,
  shouldSyncProgress,
  type ProgressPayload,
} from "@/lib/progressSync";

type Role = "PC" | "iOS" | "Android" | "PM" | "QA";

export type AccountChecklistItem = {
  id: string;
  title: string;
  etaMinutes?: number;
  done: boolean;
  locked?: boolean;
};

export type DevReadMap = {
  pre: boolean;
  env: boolean;
  flow: boolean;
  branch: boolean;
  commit: boolean;
};

type AppState = {
  userName: string;
  role: Role;
  deviceType: string;
  setUserName: (name: string) => void;
  accountItems: AccountChecklistItem[];
  setAccountItems: React.Dispatch<React.SetStateAction<AccountChecklistItem[]>>;
  toggleAccountItem: (id: string) => void;
  devReadMap: DevReadMap;
  setDevReadMap: React.Dispatch<React.SetStateAction<DevReadMap>>;
  setDevRead: (key: keyof DevReadMap, value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

const USER_NAME_KEY = "userName";
const ACCOUNT_KEY = "accounts-registration-checklist";
const DEV_READ_KEY = "dev-guide-read";
const PROGRESS_META_KEY = "onboarding-progress-meta";
const SAVE_DEBOUNCE_MS = 600;

export const DEFAULT_ACCOUNT_ITEMS: AccountChecklistItem[] = [
  { id: "corp-email", title: "账号与权限获取", etaMinutes: 3, done: true },
  { id: "vpn", title: "安装翻墙软件", etaMinutes: 8, done: false },
  { id: "aicoin", title: "安装 AiCoin 软件", etaMinutes: 5, done: false },
  { id: "itask", title: "注册 iTask 账号", etaMinutes: 5, done: false },
  { id: "gitlab", title: "注册 GitLab 账号", etaMinutes: 5, done: false },
  { id: "figma", title: "注册 Figma 账号", etaMinutes: 4, done: false },
  { id: "wechat", title: "加入企业微信群", etaMinutes: 6, done: false },
];

const DEFAULT_DEV_READ: DevReadMap = {
  pre: false,
  env: false,
  flow: false,
  branch: false,
  commit: false,
};

function normalizeAccountItems(items?: AccountChecklistItem[]) {
  if (!Array.isArray(items) || items.length === 0) return DEFAULT_ACCOUNT_ITEMS;
  const incoming = new Map(items.map((item) => [item.id, item]));
  const merged = DEFAULT_ACCOUNT_ITEMS.map((item) => {
    const remote = incoming.get(item.id);
    if (!remote) return item;
    return {
      ...item,
      ...remote,
      id: item.id,
    };
  });
  const extra = items.filter((item) => !DEFAULT_ACCOUNT_ITEMS.some((d) => d.id === item.id));
  return [...merged, ...extra];
}

function normalizeDevReadMap(map?: Partial<DevReadMap>) {
  return {
    pre: !!map?.pre,
    env: !!map?.env,
    flow: !!map?.flow,
    branch: !!map?.branch,
    commit: !!map?.commit,
  };
}

function readProgressMeta() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(PROGRESS_META_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { updatedAt?: number } | null;
    return typeof parsed?.updatedAt === "number" ? parsed.updatedAt : 0;
  } catch {
    return 0;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserNameState] = useState(() => {
    if (typeof window === "undefined") return "新用户";
    return localStorage.getItem(USER_NAME_KEY) || "新用户";
  });
  const [role] = useState<Role>("PM");
  const [deviceType] = useState(() => detectDeviceType());

  const [accountItems, setAccountItems] = useState<AccountChecklistItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ACCOUNT_ITEMS;
    try {
      const stored = window.localStorage.getItem(ACCOUNT_KEY);
      if (!stored) return DEFAULT_ACCOUNT_ITEMS;
      const parsed = JSON.parse(stored) as AccountChecklistItem[];
      if (Array.isArray(parsed) && parsed.length) return normalizeAccountItems(parsed);
    } catch {
      // ignore
    }
    return DEFAULT_ACCOUNT_ITEMS;
  });

  const [devReadMap, setDevReadMap] = useState<DevReadMap>(() => {
    if (typeof window === "undefined") return DEFAULT_DEV_READ;
    try {
      const stored = window.localStorage.getItem(DEV_READ_KEY);
      if (!stored) return DEFAULT_DEV_READ;
      const parsed = JSON.parse(stored) as Partial<DevReadMap>;
      return normalizeDevReadMap(parsed);
    } catch {
      // ignore
    }
    return DEFAULT_DEV_READ;
  });

  const [searchQuery, setSearchQueryState] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => readProgressMeta());
  const lastUpdatedAtRef = useRef(lastUpdatedAt);
  const hydratedRef = useRef(false);
  const skipNextUpdateRef = useRef(false);

  useEffect(() => {
    lastUpdatedAtRef.current = lastUpdatedAt;
  }, [lastUpdatedAt]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_NAME_KEY, userName);
  }, [userName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = accountItems.map(({ id, title, etaMinutes, done, locked }) => ({
      id,
      title,
      etaMinutes,
      done,
      locked,
    }));
    try {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [accountItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(DEV_READ_KEY, JSON.stringify(devReadMap));
    } catch {
      // ignore
    }
  }, [devReadMap]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PROGRESS_META_KEY, JSON.stringify({ updatedAt: lastUpdatedAt }));
    } catch {
      // ignore
    }
  }, [lastUpdatedAt]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const remote = await fetchProgress(controller.signal);
        if (!remote) return;
        const remoteTs =
          typeof remote.updatedAt === "string"
            ? Date.parse(remote.updatedAt)
            : typeof (remote as any).updatedAt === "number"
              ? (remote as any).updatedAt
              : 0;
        const localTs = lastUpdatedAtRef.current;
        if (remoteTs > localTs) {
          skipNextUpdateRef.current = true;
          setUserNameState(remote.userName || "新用户");
          setAccountItems(normalizeAccountItems(remote.accountItems));
          setDevReadMap(normalizeDevReadMap(remote.devReadMap));
          if (remoteTs) setLastUpdatedAt(remoteTs);
        }
      } catch {
        // ignore sync errors
      } finally {
        hydratedRef.current = true;
      }
    };
    load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (skipNextUpdateRef.current) {
      skipNextUpdateRef.current = false;
      return;
    }
    setLastUpdatedAt(Date.now());
  }, [userName, accountItems, devReadMap]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydratedRef.current) return;
    if (!shouldSyncProgress()) return;
    if (!lastUpdatedAt) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      const payload: ProgressPayload = {
        userName,
        accountItems,
        devReadMap,
        updatedAt: new Date(lastUpdatedAt).toISOString(),
      };
      saveProgress(payload, controller.signal).catch(() => {
        // ignore sync errors
      });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [userName, accountItems, devReadMap, lastUpdatedAt]);

  const setUserName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) setUserNameState(trimmed);
  }, []);

  const toggleAccountItem = useCallback((id: string) => {
    setAccountItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (it.locked) return it;
        return { ...it, done: !it.done };
      })
    );
  }, []);

  const setDevRead = useCallback((key: keyof DevReadMap, value: boolean) => {
    setDevReadMap((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setSearchQuery = useCallback((value: string) => {
    setSearchQueryState(value);
  }, []);

  const value = useMemo(
    () => ({
      userName,
      role,
      deviceType,
      setUserName,
      accountItems,
      setAccountItems,
      toggleAccountItem,
      devReadMap,
      setDevReadMap,
      setDevRead,
      searchQuery,
      setSearchQuery,
    }),
    [
      userName,
      role,
      deviceType,
      setUserName,
      accountItems,
      setAccountItems,
      toggleAccountItem,
      devReadMap,
      setDevReadMap,
      setDevRead,
      searchQuery,
      setSearchQuery,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}
