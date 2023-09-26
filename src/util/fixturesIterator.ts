import { IFixture } from '../interface';
import { DirectedGraph } from 'graphology';
import { topologicalSort, willCreateCycle } from 'graphology-dag';

export function* fixturesIterator(fixtures: IFixture[]) {
    const graph = new DirectedGraph<IFixture>({ allowSelfLoops: false });
    const fixturesByName = new Map<string, IFixture>();

    for (const fixture of fixtures) {
        fixturesByName.set(fixture.name, fixture);
        graph.addNode(fixture.name, fixture);
    }

    for (const fixture of fixtures) {
        for (const dep of fixture.dependencies) {
            if (willCreateCycle(graph, dep, fixture.name)) {
                throw new Error(`There is a cycle between ${dep} and ${fixture.name}`);
            }
            graph.addDirectedEdge(dep, fixture.name);
        }
    }

    for (const name of topologicalSort(graph)) {
        yield fixturesByName.get(name)!;
    }
}
