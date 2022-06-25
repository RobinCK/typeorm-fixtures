import { sum } from 'lodash';
import { IFixture } from '../interface';

export function* fixturesIterator(fixtures: IFixture[]) {
    const state: any = {};

    while (true) {
        const result = fixtures.find((fixture) => {
            return (
                sum(
                    fixture.dependencies.map((dependency: string) => {
                        return state[dependency] === undefined ? 0 : 1;
                    }),
                ) === fixture.dependencies.length && !state[fixture.name]
            );
        });

        if (result) {
            state[result.name] = true;
            yield result;
        } else {
            return;
        }
    }
}
