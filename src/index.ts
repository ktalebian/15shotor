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

let twilio = null;
const getTwilio = (username: string, password: string): Twilio => {
  if (twilio) {
    return twilio;
  }

  twilio = new Twilio(username, password);

  return twilio;
};

export const Shotor = (username: string, password: string, documentSid: string) => {
  if (!username || !password) {
    throw new Error('username/password are required');
  }
  if (!documentSid) {
    throw new Error('Document identifier is required');
  }

  const client = getTwilio(username, password);
  const syncDocument = client.sync.services('default').documents(documentSid);

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

export const Parser = () => {
  const getTimer = (message: string) => {
    if (!message || message === '') {
      return -1;
    }

    const match = message
      .trim()
      .toLowerCase()
      .match(/badbakht mishi in (\d*):(\d*):(\d*)/);
    if (!match || match.length !== 4) {
      return -1;
    }

    return (
      Date.now() + 1000 * (parseInt(match[1], 10) * 86400 + parseInt(match[2], 10) * 3600 + parseInt(match[3], 10) * 60)
    );
  };

  return {
    getTimer,
  };
};

export const Messenger = (username: string, password: string, from: string) => {
  if (!username || !password) {
    throw new Error('username/password are required');
  }
  if (!from) {
    throw new Error('From number is required');
  }

  const client = getTwilio(username, password);
  const sendMessage = async (body: string, to: string) => client.messages.create({ body, to, from });

  const congratulations = async (animal: Animal, to: string) => {
    const emoji = animal === 'shotor' ? '🐪' : '🐏';
    return sendMessage(`Congratulations 🎉! You got a ${emoji}!`, to).then(() => true);
  };

  const timerSet = async (animal: Animal, timestamp: number, to: string) => {
    const date = new Date(timestamp).toString();
    return sendMessage(`Okh okh! You'll be badbakht on ${date}`, to).then(() => true);
  };

  return {
    congratulations,
    timerSet,
  };
};
