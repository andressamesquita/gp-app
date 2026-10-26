import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <TabBar {...p} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="jornada" />
      <Tabs.Screen name="inicio" />
      <Tabs.Screen name="servicos" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
