import { useEffect, useState } from "react";
import type { Session } from "../types/session";
import sessionContext from "../contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { fetchAPIFromBackendSingleWithErrorHandling } from "@/api";
const SessionLoading = () => {
  return <div>Loading who are you...</div>;
};
const SessionError = ({ error }: { error: Error }) => {
  return <div>Error loading session: {error.message}</div>;
};
const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionError, setSessionError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      setSessionLoading(true);
      setSessionError(null);
      try {
        const response =
          await fetchAPIFromBackendSingleWithErrorHandling<Session>("/user/me");
        if ("detail" in response) {
          // 401 is expected when the user is not authenticated
          //So we just keep the session as null
          if (response.status !== 401) {
            throw new Error(response.detail);
          }
          return;
        }
        const apiData = response.data;
        const hydratedSession: Session = {
          ...apiData,
          hasPermission: (permission: string) =>
            Boolean(apiData.permissionMap[permission]),
          logout: async () => {
            const res = await fetchAPIFromBackendSingleWithErrorHandling<{
              redirect: string;
            }>("/user/logout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              redirect: "manual",
            });
            setSession(null);
            if (!("detail" in res) && res.data.redirect) {
              window.location.href = res.data.redirect;
            }
          },
        };
        setSession(hydratedSession);
      } catch (error) {
        setSession(null);
        console.error("Failed to fetch session:", error);
        setSessionError(error as Error);
      } finally {
        setSessionLoading(false);
      }
    };
    fetchSession();
  }, []);
  if (sessionError) {
    return <SessionError error={sessionError} />;
  }
  if (!session && !sessionLoading) {
    let path = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    if (window.location.pathname.startsWith("/user/login")) {
      path = "/";
    }
    return <Navigate to={`/user/login?next=${path}`} replace />;
  }
  if (sessionLoading) {
    return <SessionLoading />;
  }

  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
};
export default SessionProvider;
