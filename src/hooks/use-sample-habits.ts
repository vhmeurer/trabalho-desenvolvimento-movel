import { useState } from 'react';
import { Alert } from 'react-native';

import { useHabits } from '@/context/habits-context';

export function useSampleHabits() {
  const { addSampleHabits } = useHabits();
  const [loading, setLoading] = useState(false);

  async function loadSampleHabits() {
    setLoading(true);
    try {
      await addSampleHabits();
    } catch {
      Alert.alert('Não foi possível carregar', 'Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return { loading, loadSampleHabits };
}
