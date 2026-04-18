import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, usePathname } from 'expo-router';

import { theme } from '@/constants/theme';
import { ActionMenuModal } from '@/components/ActionMenuModal';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
}) {
  return <FontAwesome size={props.size || 20} {...props} />;
}

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const pathname = usePathname();
  
  // Ex: '/dharma' -> 'dharma'
  const activeTab = pathname.split('/').pop() || 'dharma';

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.profile,
          tabBarInactiveTintColor: theme.colors.tabInactive,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            height: 76,
            paddingTop: 10,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
        }}>
        <Tabs.Screen
          name="dharma"
          options={{
            title: 'Dharma',
            tabBarIcon: ({ color }) => <TabBarIcon name="leaf" color={color} />,
          }}
        />
        <Tabs.Screen
          name="artha"
          options={{
            title: 'Artha',
            tabBarIcon: ({ color }) => <TabBarIcon name="briefcase" color={color} />,
          }}
        />
        <Tabs.Screen
          name="action"
          options={{
            title: 'Action',
            tabBarIcon: () => <TabBarIcon name="plus-circle" color={theme.colors.text} size={32} />,
            tabBarShowLabel: false,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setModalVisible(true);
            },
          }}
        />
        <Tabs.Screen
          name="kama"
          options={{
            title: 'Kama',
            tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          }}
        />
        <Tabs.Screen
          name="moksha"
          options={{
            title: 'Moksha',
            tabBarIcon: ({ color }) => <TabBarIcon name="sun-o" color={color} />,
          }}
        />
      </Tabs>
      <ActionMenuModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        activeTab={activeTab === 'action' ? 'dharma' : activeTab}
      />
    </>
  );
}
