const doesSelectorExist = (selector) => {
  const element = document.querySelector(selector);

  if (element) {
    return true;
  } else {
    return false;
  }
};

export { doesSelectorExist };
