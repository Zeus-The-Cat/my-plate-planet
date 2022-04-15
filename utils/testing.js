#!/usr/bin/env node

// Undirected graph, not weighted, no cycles
// Fireship example for referencing 
// Data
const airports = 'PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM'.split(' ');

const routes = [
    ['PHX', 'LAX'],
    ['PHX', 'JFK'],
    ['JFK','OKC'],
    ['JFK','HEL'],
    ['JFK','LOS'],
    ['MEX','LAX'],
    ['MEX','BKK'],
    ['MEX','LIM'],
    ['LIM','BKK']
];

// The Graph
const adjacencyList  = new Map();

airports.forEach(addNode);
routes.forEach(route=>addEdge(...route));

const addNode = (airport) => {
    adjacencyList.set(airport,[]);
}

// Add edge, undirected
const addEdge = (origin, destination) => {
    adjacencyList.get(origin).push(destination);
    adjacencyList.get(destination).push(origin);
}

// BFS queue O(V+E) Linear O(N)
const bfs = (start,target) => {
    // finding all paths to target node in graph
    const queue = [start]
    const visited = new Set(); // Unique array

    while(queue.length > 0){
        const airport = queue.shift(); //mutates the queue like pop
        const destinations = adjacencyList.get(airport);
        for (const destination of destinations){
            if(destination === target){
                console.log('found it!');
                return;
            }
            if (!visited.has(destination)){
                visited.add(destination);
                queue.push(destination)
            }
        }
    }
}

// DFS recursive O(V+E) Linear O(N)
const dfs = (start, visited = new Set()) => {
    // Depth First Search finding a route of any quickly
    visited.add(start);
    const destinations = adjacencyList.get(start);
    for (const destination of destinations){
        if (destination === 'BKK'){
            console.log('DFS found Bangkok in steps');
            return;
        }
        if(!visited.has(destination)){
            dfs(destination,visited);
        }
    }
}

// Console Reference
//console.assert(true,'does nothing')
//console.assert(false,'Assertion failed, this prints')
//console.log({airports,adjacencyList}) // adds labels to variables on print
// console.table([routes])
// console.groupCollapsed('Error type A')
// console.groupCollapsed('Error type A')
// console.groupCollapsed('Error type A')
// console.dir({foo:'10',next:['one','two']}) // triangle dropdown in browser console
// console.count('label');
// console.time(); // Starts Timer
// console.timeLog(); // Time since time last called
// function bottom(){
//     function top(){
//         console.trace('who called upon me?')
//     }
//     top();
// }
// bottom();
// const style = 'color:teal;background-color:black;font-size:20px';
// console.log('%c JavaScript can be Beautiful!',style)
