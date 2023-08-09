const identity = <T>(item: T): T => {
  return item;
};

console.log(identity<string>("hashib"));
