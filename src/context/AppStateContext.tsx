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
  pc_pre: boolean;
  pc_env: boolean;
  pc_flow: boolean;
  pc_branch: boolean;
  pc_commit: boolean;
  ios_pre: boolean;
  ios_env: boolean;
  ios_flow: boolean;
  ios_branch: boolean;
  ios_commit: boolean;
  android_pre: boolean;
  android_env: boolean;
  android_flow: boolean;
  android_branch: boolean;
  android_commit: boolean;
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
  toolsRead: boolean;
  setToolsRead: (value: boolean) => void;
  workflowRead: boolean;
  setWorkflowRead: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

const USER_NAME_KEY = "userName";
const ACCOUNT_KEY = "accounts-registration-checklist";
const DEV_READ_KEY = "dev-guide-read";
const TOOLS_READ_KEY = "tools-guide-read";
const WORKFLOW_READ_KEY = "workflow-guide-read";
const PROGRESS_META_KEY = "onboarding-progress-meta";
const SAVE_DEBOUNCE_MS = 600;

export const DEFAULT_ACCOUNT_ITEMS: AccountChecklistItem[] = [
  { id: "corp-email", title: "获取企业邮箱与申请版本日志推送", etaMinutes: 3, done: true },
  { id: "vpn", title: "安装VPN", etaMinutes: 8, done: false },
  { id: "aicoin", title: "安装 AiCoin 软件", etaMinutes: 5, done: false },
  { id: "itask", title: "注册 iTask 账号", etaMinutes: 5, done: false },
  { id: "gitlab", title: "注册 GitLab 账号", etaMinutes: 5, done: false },
  { id: "figma", title: "注册 Figma 账号", etaMinutes: 4, done: false },
  { id: "wechat", title: "加入企业微信群", etaMinutes: 6, done: false },
];

const DEFAULT_DEV_READ: DevReadMap = {
  pc_pre: false,
  pc_env: false,
  pc_flow: false,
  pc_branch: false,
  pc_commit: false,
  ios_pre: false,
  ios_env: false,
  ios_flow: false,
  ios_branch: false,
  ios_commit: false,
  android_pre: false,
  android_env: false,
  android_flow: false,
  android_branch: false,
  android_commit: false,
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
      title: item.title,
      etaMinutes: item.etaMinutes,
    };
  });
  const extra = items.filter((item) => !DEFAULT_ACCOUNT_ITEMS.some((d) => d.id === item.id));
  return [...merged, ...extra];
}

function normalizeDevReadMap(map?: Partial<DevReadMap> & Record<string, unknown>) {
  const get = (key: keyof DevReadMap, legacyKey?: string) => {
    const incoming = map?.[key];
    if (typeof incoming === "boolean") return incoming;
    if (legacyKey) {
      const legacy = (map as Record<string, unknown>)?.[legacyKey];
      if (typeof legacy === "boolean") return legacy;
    }
    return false;
  };
  return {
    pc_pre: get("pc_pre", "pre"),
    pc_env: get("pc_env", "env"),
    pc_flow: get("pc_flow", "flow"),
    pc_branch: get("pc_branch", "branch"),
    pc_commit: get("pc_commit", "commit"),
    ios_pre: get("ios_pre"),
    ios_env: get("ios_env"),
    ios_flow: get("ios_flow"),
    ios_branch: get("ios_branch"),
    ios_commit: get("ios_commit"),
    android_pre: get("android_pre"),
    android_env: get("android_env"),
    android_flow: get("android_flow"),
    android_branch: get("android_branch"),
    android_commit: get("android_commit"),
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

  const [toolsRead, setToolsReadState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = window.localStorage.getItem(TOOLS_READ_KEY);
      if (!stored) return false;
      return stored === "true";
    } catch {
      return false;
    }
  });

  const [workflowRead, setWorkflowReadState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = window.localStorage.getItem(WORKFLOW_READ_KEY);
      if (!stored) return false;
      return stored === "true";
    } catch {
      return false;
    }
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
      localStorage.setItem(TOOLS_READ_KEY, toolsRead ? "true" : "false");
    } catch {
      // ignore
    }
  }, [toolsRead]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(WORKFLOW_READ_KEY, workflowRead ? "true" : "false");
    } catch {
      // ignore
    }
  }, [workflowRead]);

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
  }, [userName, accountItems, devReadMap, toolsRead, workflowRead]);

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

  const setToolsRead = useCallback((value: boolean) => {
    setToolsReadState(value);
  }, []);

  const setWorkflowRead = useCallback((value: boolean) => {
    setWorkflowReadState(value);
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
      toolsRead,
      setToolsRead,
      workflowRead,
      setWorkflowRead,
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
      toolsRead,
      setToolsRead,
      workflowRead,
      setWorkflowRead,
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
