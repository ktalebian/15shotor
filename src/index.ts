import { Twilio } from 'twilio';

type Data = {
  count: number;
  timer: number;
};
type AnimalData = {
  shotor: Data;
  bozghaleh: Data;
};
type Animal = keyof AnimalData;

export default function Shotor(username: string, password: string, documentSid: string) {
  if (!username || !password) {
    throw new Error('username/password are required');
  }
  if (!documentSid) {
    throw new Error('Document identifier is required');
  }

  const twilio = new Twilio(username, password);
  const syncDocument = twilio.sync.services('default').documents(documentSid);

  const getState = async () => syncDocument.fetch();
  const getData = async (): Promise<AnimalData> => getState().then((resp) => resp.data);
  const getAnimalData = async (animal: Animal): Promise<Data> => getData().then((data) => data[animal]);
  const setState = async (animal: Animal, state: keyof Data, value: number): Promise<Data> => {
    const data = await getData();
    data[animal][state] = value;

    return syncDocument.update({ data }).then((resp) => resp.data[animal]);
  };

  const incrementCount = async (animal: Animal) => {
    const data = await getAnimalData(animal);

    return setState(animal, 'count', data.count + 1);
  };
  const decrementCount = async (animal: Animal) => {
    const data = await getAnimalData(animal);

    return setState(animal, 'count', Math.max(0, data.count - 1));
  };
  const hasTimer = async (animal: Animal) => getAnimalData(animal).then((data) => data.timer > Date.now());
  const setTimer = async (animal: Animal, amount: number) => {
    if (await hasTimer(animal)) {
      throw new Error('A timer is already set');
    }

    return setState(animal, 'timer', amount);
  };

  return {
    getState,
    getData,
    getAnimalData,
    setState,
    incrementCount,
    decrementCount,
    hasTimer,
    setTimer,
  };
};