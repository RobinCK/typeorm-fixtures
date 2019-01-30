export interface IProcessor<T> {
    preProcess?(name: string, object: any): any | Promise<any>;
    postProcess?(name: string, object: T): void | Promise<void>;
}
