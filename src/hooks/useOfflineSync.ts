import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useTaskStore } from '@store/taskStore';

export function useOfflineSync(): void {
  const syncPendingMutations = useTaskStore((s) => s.syncPendingMutations);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        syncPendingMutations().catch(() => {});
      }
    });

    return unsubscribe;
  }, [syncPendingMutations]);
}
