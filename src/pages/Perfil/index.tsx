import loadable from '@loadable/component';
const Profile = loadable(
  () => import(/* webpackChunkName: 'ProfileChunk' */ './Profile')
);
const Notifications = loadable(
  () => import(/* webpackChunkName: 'NotificationsChunk' */ './Notifications')
);
const Help = loadable(
  () => import(/* webpackChunkName: 'HelpChunk' */ './Help')
);
const Questions = loadable(
  () => import(/* webpackChunkName: 'QuestionsChunk' */ './Questions')
);
const Config = loadable(
  () => import(/* webpackChunkName: 'ConfigChunk' */ './Config')
);
const ConfigNoti = loadable(
  () => import(/* webpackChunkName: 'ConfigNotiChunk' */ './ConfigNoti')
);

export default {
  Profile,
  Notifications,
  Help,
  Questions,
  Config,
  ConfigNoti,
};
