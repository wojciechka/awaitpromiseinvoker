import { AwaitPromiseCallback, AwaitPromiseInvoker } from "../index";

import { sleep } from "./helpers";

import { expect } from "chai";

// helper test values
const firstValue = "value01";
const secondValue = "value02";
const thirdValue = "value03";

let counter: number;
let values: string[];
let invoker: AwaitPromiseInvoker<string>;
let immediateCallback = <AwaitPromiseCallback<string>> function(value: string): void {
  values.push(value);
  counter++;
};
let immediatePromiseCallback = async function(value: string): Promise<void> {
  values.push(value);
  counter++;
};
let delayedPromiseCallback = async function(value: string): Promise<void> {
  values.push(value);
  counter++;
  await sleep(50);
};

describe("AwaitPromiseInvoker", () => {
  beforeEach(() => {
    counter = 0;
    values = [];
  });
  it("does not invoke callback", async () => {
    invoker = new AwaitPromiseInvoker<string>({callback: immediateCallback});
    await sleep(200);
    expect(values.length).to.equal(0);
  });

  it("invokes immediate caller expected amount of times", async () => {
    invoker = new AwaitPromiseInvoker<string>({callback: immediateCallback});
    invoker.emit(firstValue);
    invoker.emit(secondValue);
    invoker.emit(thirdValue);
    await sleep(100);
    expect(values.length).to.equal(3);
    expect(values[0]).to.equal(firstValue);
    expect(values[1]).to.equal(secondValue);
    expect(values[2]).to.equal(thirdValue);
  });

  it("invokes delayedPromiseCallback caller at start and end if no delays occur", async () => {
    invoker = new AwaitPromiseInvoker<string>({callback: delayedPromiseCallback});
    invoker.emit(firstValue);
    invoker.emit(secondValue);
    invoker.emit(thirdValue);
    await sleep(200);
    expect(values.length).to.equal(2);
    expect(values[0]).to.equal(firstValue);
    expect(values[1]).to.equal(thirdValue);
  });

  it("invokes delayedPromiseCallback all the time if more delay between invocations", async () => {
    invoker = new AwaitPromiseInvoker<string>({callback: delayedPromiseCallback});
    invoker.emit(firstValue);
    await sleep(100);
    invoker.emit(secondValue);
    await sleep(100);
    invoker.emit(thirdValue);
    await sleep(100);
    expect(values.length).to.equal(3);
    expect(values[0]).to.equal(firstValue);
    expect(values[1]).to.equal(secondValue);
    expect(values[2]).to.equal(thirdValue);
  });
});
