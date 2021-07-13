import { generateRandom } from '@chatroom/utils';

const avatars = Array.from({ length: 7 }).map(
  (_, index) => `https://material-ui.com/static/images/avatar/${index + 1}.jpg`,
);

export const generateRandomAvatar = (): string => {
  return avatars[generateRandom(0, 6)];
};
