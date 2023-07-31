type ReducibleErrors = (readonly [boolean, (v: boolean) => void])[];

export const reduceErrors = (data: ReducibleErrors) =>
  data.reduce((has, [value, setError]) => {
    if (!value) return has;

    setError(true);
    return true;
  }, false);
