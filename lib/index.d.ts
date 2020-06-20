declare type Data = {
    count: number;
    timer: number;
};
declare type AnimalData = {
    shotor: Data;
    bozghaleh: Data;
};
declare type Animal = keyof AnimalData;
export default function Shotor(username: string, password: string, documentSid: string): {
    getState: () => Promise<import("twilio/lib/rest/sync/v1/service/document").DocumentInstance>;
    getData: () => Promise<AnimalData>;
    getAnimalData: (animal: Animal) => Promise<Data>;
    setState: (animal: Animal, state: keyof Data, value: number) => Promise<Data>;
    incrementCount: (animal: Animal) => Promise<Data>;
    decrementCount: (animal: Animal) => Promise<Data>;
    hasTimer: (animal: Animal) => Promise<boolean>;
    setTimer: (animal: Animal, amount: number) => Promise<Data>;
};
export {};
