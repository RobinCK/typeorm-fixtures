export interface IProcessor<T> {
    preProcess?(name: string, object: any): any;
    postProcess?(name: string, object: T): void;
}
