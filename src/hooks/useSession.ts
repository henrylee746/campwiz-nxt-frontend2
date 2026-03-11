import { useContext } from "react";
import sessionContext from "../contexts/SessionContext";
import type { Session } from "../types/session";

const useSession = (): Session => {
  const session = useContext(sessionContext);
  //Assert that the session is not null
  if (!session)
    throw new Error("useSession must be used within a SessionProvider");
  return session;
};

export default useSession;
