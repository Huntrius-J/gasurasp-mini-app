import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  RASP: 'rasp',
  RASPLIST: 'rasplist'
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.RASP, `/${DEFAULT_VIEW_PANELS.RASP}`, []),
      createPanel(DEFAULT_VIEW_PANELS.RASPLIST, '/', []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
