import { IFixture } from '../interface';
import { PriorityQueue } from 'typescript-collections';
export function* fixturesIterator(fixtures: IFixture[]) {
    const processed = new Set<string>();
    const queue = new PriorityQueue<IFixture>((a, b) => {
        const aDependencies = a.dependencies.filter((dep) => !processed.has(dep)).length;
        const bDependencies = b.dependencies.filter((dep) => !processed.has(dep)).length;

        return bDependencies - aDependencies;
    });

    for (const fixture of fixtures) {
        queue.add(fixture);
    }

    while (!queue.isEmpty()) {
        const fixture = queue.dequeue();
        if (!fixture) {
            // theoretically impossible, but keep the linter happy.
            continue;
        }

        if (fixture.dependencies.every((dep) => processed.has(dep))) {
            processed.add(fixture.name);
            yield fixture;
        } else {
            queue.add(fixture);
        }
    }
}
