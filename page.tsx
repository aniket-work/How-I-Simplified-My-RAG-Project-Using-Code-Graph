'use client'

import { createContext, useState } from 'react';
import { Chat } from './components/chat';
import { Graph, Node } from './components/model';
import { Github, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CodeGraph } from './components/code-graph';
import { toast } from '@/components/ui/use-toast';
import { GraphContext } from './components/provider';

export default function Home() {

  const [graph, setGraph] = useState(Graph.empty());

  function onFetchGraph(url: string) {
    let value = url;
    if (!value || value.length === 0) {
      value = 'https://github.com/falkorDB/falkordb-py';
    }

    setGraph(Graph.empty())

    // Send the user query to the server to fetch a repo graph
    fetch('/api/repo', {
      method: 'POST',
      body: JSON.stringify({
        url: value
      })
    }).then(async (result) => {
      if (result.status >= 300) {
        throw Error(await result.text())
      }
      return result.json()
    }).then(data => {
      let graph = Graph.create(data);
      setGraph(graph);
    }).catch((error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    });
  }

  // Send the user query to the server to expand a node
  async function onFetchNode(node: Node) {
    return fetch(`/api/repo/${graph.Id}/${node.id}`, {
      method: 'GET'
    }).then(async (result) => {
      if (result.status >= 300) {
        throw Error(await result.text())
      }
      return result.json()
    }).then(data => {
      let newElements = graph.extend(data)
      setGraph(graph)
      return newElements
    }).catch((error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
      return [] as any[]
    })
  }

  return (
    <main className="h-screen flex flex-col">
<header className="flex flex-col items-center justify-between p-6 bg-white shadow-md border-b">
  <div className="flex items-center mb-2">
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-8 w-8 text-gray-900 mr-2"
  viewBox="0 0 24 24"
  fill="currentColor"
>
  <path d="M3 10h2v10H3V10zm4-4h2v14H7V6zm4-2h2v16h-2V4zm4 6h2v10h-2V10zm4-4h2v14h-2V6z" />
</svg>
    <h1 className='text-4xl font-bold text-gray-900'>
      Streamlining My RAG Project with Code Graph
    </h1>
  </div>
  <nav className="space-x-6">
    <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-200">Home</a>
    <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-200">About</a>
    <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-200">Contact</a>
  </nav>
</header>

      <PanelGroup direction="horizontal" className="w-full h-full">
        <Panel defaultSize={75} className="flex flex-col border" collapsible={true} minSize={30}>
          <GraphContext.Provider value={graph}>
            <CodeGraph onFetchGraph={onFetchGraph} onFetchNode={onFetchNode} />
          </GraphContext.Provider>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-500" />
        <Panel className="flex flex-col border" defaultSize={25} collapsible={true} minSize={10}>
          <Chat repo={graph.Id} />
        </Panel>
      </PanelGroup>
    </main>
  )
}
