interface DBScanResult<T> {
    clusters: T[][];
    noise: T[];
}

export default class DBScan<T> {
    private visited: Map<T, boolean> = new Map();
    private noise: T[] = [];
    private assigned: Map<T, boolean> = new Map();
    private clusters: T[][] = [];

    constructor(
        private dataset: T[],
        private epsilon: number,
        private minPts: number,
        private distance: (a: T, b: T) => number
    ) {
        return;
    }

    private regionQuery(id: T): Set<T> {
        const neighbours: Set<T> = new Set();
        for (const point of this.dataset) {
            const distance = this.distance(point, id);
            if (distance < this.epsilon) neighbours.add(point);
        }
        return neighbours;
    }
    private addToCluster(id: T, cluster: T[]): void {
        cluster.push(id);
        this.assigned.set(id, true);
    }
    private expandCluster(cluster: T[], neighbours: Set<T>): void {
        for (const neighbour of neighbours) {
            if (!this.visited.get(neighbour)) {
                this.visited.set(neighbour, true);
                const neighboursOfNeighbour = this.regionQuery(neighbour);
                if (neighboursOfNeighbour.size >= this.minPts)
                    for (const entry of neighboursOfNeighbour)
                        neighbours.add(entry);
            }

            if (!this.assigned.get(neighbour))
                this.addToCluster(neighbour, cluster);
        }
    }

    run(): DBScanResult<T> {
        for (const point of this.dataset)
            if (!this.visited.get(point)) {
                // Visit the point if not visited
                this.visited.set(point, true);

                const neighbours = this.regionQuery(point);
                if (neighbours.size < this.minPts) this.noise.push(point);
                else {
                    const cluster: T[] = [];
                    this.clusters.push(cluster);
                    this.addToCluster(point, cluster);
                    this.expandCluster(cluster, neighbours);
                }
            }
        return { clusters: this.clusters, noise: this.noise };
    }
}
