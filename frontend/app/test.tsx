import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { BASE_URL } from '../constants/api';

export default function TestScreen() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch(`${BASE_URL}/health`)
      .then(res => res.json())
      .then(data => setStatus(JSON.stringify(data)))
      .catch(err => setStatus('ERROR: ' + err.message));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Backend status: {status}</Text>
    </View>
  );
}