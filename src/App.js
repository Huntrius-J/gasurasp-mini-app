import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Rasp, RaspList } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [popout, setPopout] = useState();
  const platform = window.WebApp.platform;
  const storage = (platform=='android' || platform=='ios')?window.WebApp.DeviceStorage:window.localStorage;
  
  function initStorageIfNeeded() {

  Promise.resolve(storage.getItem('favorite_ids'))
    .then((result) => {
      const rawValue = (platform === 'android' || platform === 'ios') ? result?.value : result;
      if (rawValue == null || rawValue === '') {
        storage.setItem('favorite_ids', JSON.stringify([]));
      }
    })
    .catch((err) => {
      const errorStr = String(err?.message || err);
      if (errorStr.includes('not_found')) {
        storage.setItem('favorite_ids', JSON.stringify([]));
      } else {
        console.error('Непредвиденная ошибка хранилища:', err);
      }
    });
}


  useEffect(() => {
    async function fetchData() {
      
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
    initStorageIfNeeded();
  }, []);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
        <RaspList id="rasplist"/> 
        <Rasp id="rasp"/>
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};
