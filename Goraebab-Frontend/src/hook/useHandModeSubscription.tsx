import { useEffect } from 'react';
import { useHandModeStore } from '@/store/handModeStore';

const useHandModeSubscription = (onChange: (isHandMode: boolean) => void) => {
  useEffect(() => {
    // 상태 변경을 구독합니다.
    const unsubscribe = useHandModeStore.subscribe((state) => {
      const newIsHandMode = state.isHandMode;
      onChange(newIsHandMode);
    });

    // 컴포넌트가 언마운트될 때 구독을 해제합니다.
    return () => unsubscribe();
  }, [onChange]);
};

export default useHandModeSubscription;
