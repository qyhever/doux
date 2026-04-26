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
