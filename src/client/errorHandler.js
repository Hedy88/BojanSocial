const errorHandler = (error, file, line) => {
  // alert user
  alert("js went boom lol: \n" + error + "\n" + file + ":" + line);

  return;
};

export { errorHandler };
