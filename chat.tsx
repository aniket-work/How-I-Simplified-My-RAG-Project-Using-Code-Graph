import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "../api/repo/questions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

enum MessageTypes {
    Query,
    Response,
    Pending,
}

interface Message {
    text: string;
    type: MessageTypes;
}

export function Chat(props: { repo: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [query, setQuery] = useState('');
    const bottomRef: React.RefObject<HTMLDivElement> = useRef(null);

    async function handleQueryInputChange(event: any) {
        if (event.key === "Enter") {
            await handleQueryClick(event);
        }
        const value = event.target.value;
        setQuery(value);
    }

    async function sendQuery(q: string) {
        if (!q) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Please enter a question.",
            })
            setQuery("")
            return
        }

        setMessages((messages) => [...messages, { text: q, type: MessageTypes.Query }, { text: "", type: MessageTypes.Pending }]);

        return fetch(`/api/repo/${props.repo}?q=${encodeURIComponent(q)}&type=text`, {
            method: 'GET'
        }).then(async (result) => {
            if (result.status >= 300) {
                throw Error(await result.text())
            }
            return result.json()
        }).then(data => {
            setMessages(function (messages) {
                if (messages[messages.length - 1].type === MessageTypes.Pending) {
                    messages = messages.slice(0, -1);
                }
                return [...messages, { text: data.result, type: MessageTypes.Response }];
            });
        }).catch((error) => {
            setMessages(function (messages) {
                if (messages[messages.length - 1].type === MessageTypes.Pending) {
                    return messages.slice(0, -1);
                }
                return messages
            });
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message,
            });
        });
    }

    async function handleQueryClick(event: any) {
        event.preventDefault();
        return sendQuery(query.trim());
    }

    async function onQuestionSelected(value: string) {
        setQuery(value)
        return sendQuery(value)
    }

    useEffect(() => {
        bottomRef.current?.scrollTo(0, bottomRef.current?.scrollHeight);
    }, [messages]);

    return (
        <>
            <main ref={bottomRef} className="border p-4 flex-1 space-y-4 overflow-auto">
                {messages.map((message, index) => {
                    if (message.type === MessageTypes.Query) {
                        return (
                            <div key={index} className="flex items-end gap-2 justify-end">
                                <div className="rounded-lg bg-blue-500 text-white p-3 max-w-[80%]">
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                                </div>
                            </div>
                        )
                    } else if (message.type === MessageTypes.Response) {
                        return (
                            <div key={index} className="flex items-end gap-2">
                                <div className="rounded-lg bg-zinc-200 p-3 max-w-[80%]">
                                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={index} className="flex items-end gap-2">
                                <div>
                                    <Image src="/dots.gif" width={100} height={10} alt="Waiting for response" />
                                </div>
                            </div>
                        )
                    }
                })}
            </main>
            <footer className="border p-4">
                {props.repo && (
                    <form className="flex flex-row gap-2 w-full" onSubmit={handleQueryClick}>
                        <Input
                            className="flex-1"
                            placeholder="Explore Your Code"
                            onChange={handleQueryInputChange}
                            value={query}
                        />
                        <Button type="submit" className="border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </Button>
                    </form>
                )}
            </footer>
        </>
    );
}