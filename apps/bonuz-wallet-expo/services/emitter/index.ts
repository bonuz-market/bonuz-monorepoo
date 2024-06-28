import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

const Emitter = {
  on: (event: string, fn: any) => eventEmitter.on(event, fn),
  once: (event: string, fn: any) => eventEmitter.once(event, fn),
  off: (event: string, fn: any) => eventEmitter.off(event, fn),
  emit: (event: string, payload?: any) => eventEmitter.emit(event, payload),
};

Object.freeze(Emitter);

export default Emitter;
