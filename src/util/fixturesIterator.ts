import { sum } from 'lodash';
import { IFixture } from '../interface';

export function* fixturesIterator(fixtures: IFixture[]) {
    const state: any = {};

    while (true) {
        const result = fixtures.find(
            (l) =>
                sum(l.dependencies.map((d: string) => (state[d] !== undefined ? 1 : 0))) === l.dependencies.length &&
                !state[l.name],
        );

        if (result) {
            state[result.name] = true;
            yield result;
        } else {
            return;
        }
    }
}
