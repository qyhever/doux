import React from 'react';

export const performTransition = async ({
  animate,
  commit,
}: {
  animate: () => Promise<void>;
  commit: () => void;
}) => {
  await animate();
  commit();
};

const VideoFeed = () => null;

export default VideoFeed;
