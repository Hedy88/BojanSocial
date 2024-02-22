const isLessThen10SecondsAgo = (date) => {
  const now = new Date().getTime();
  date = date.getTime();

  const dif = now - date;
  return dif < 10000;
};

export { isLessThen10SecondsAgo }
