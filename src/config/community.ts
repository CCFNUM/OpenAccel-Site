export type ForumProvider = 'github-discussions' | 'discourse' | 'flarum';

export const communityConfig = {
  forumProvider: 'github-discussions' as ForumProvider,
  githubOrg: 'CCFNUM',
  githubRepo: 'OpenAccel',
  chatOptions: [
    // { name: 'Matrix', url: '[TODO: maintainers]' },
    // { name: 'Zulip', url: '[TODO: maintainers]' },
  ],
};