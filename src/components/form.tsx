import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { color } from '@/theme/tokens';
import { Icon } from './Icon';
import { inputStyle } from './ui';

export function maskCpf(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function PasswordInput({ placeholder, value, onChangeText }: { placeholder: string; value: string; onChangeText: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ justifyContent: 'center' }}>
      <TextInput value={value} onChangeText={onChangeText} secureTextEntry={!show} placeholder={placeholder} placeholderTextColor={color.muted} style={[inputStyle, { paddingRight: 52 }]} />
      <Pressable accessibilityRole="button" accessibilityLabel={show ? 'Ocultar senha' : 'Mostrar senha'} onPress={() => setShow((s) => !s)} style={eye}>
        <Icon name={show ? 'eyeoff' : 'eye'} size={20} color={color.muted} />
      </Pressable>
    </View>
  );
}


const eye = { position: 'absolute', right: 4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' } as const;
