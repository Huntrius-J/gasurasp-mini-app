import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './AppConfig.js';

vkBridge.send('VKWebAppInit');

handleMaxAppParameters() 
createRoot(document.getElementById('root')).render(<AppConfig />);

function handleMaxAppParameters() {
  window.history.replaceState(
    null, 
    null, 
    window.location.hash = '#/'
  );
}

if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}
