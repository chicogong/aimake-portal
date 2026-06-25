---
title: "Building an Agent-to-Agent (A2A) Multi-Agent Server in Go"
date: "2026-06-25"
description: "A deep dive into the architecture of a high-performance streaming server that routes conversations between specialized AI agents using Intent Detection and TRPC."
---

# The Era of Multi-Agent Systems

When we think about LLMs today, the standard paradigm is Human-to-Agent (H2A). You type a prompt, the AI answers. But as systems grow more complex, a single monolithic prompt is no longer sufficient. We need specialized agents talking to each other.

Welcome to the **Agent-to-Agent (A2A)** era.

In this devlog, I'll walk you through the architecture of a **high-performance A2A Multi-Agent Server** I built using Golang, OpenAI's streaming API, and `trpc-go`.

## The Core Architecture

The goal of this server is to act as a highly concurrent traffic router and task manager for AI conversations. Instead of a simple request-response model, the server relies on a **Task-based architecture** to manage long-running streams.

### 1. The Task Manager
Streaming AI responses (especially Voice or long text generation) cannot be handled by simple HTTP timeouts. The server implements a robust `TaskManager` that handles the lifecycle of every conversation:
- `POST /` to spawn a new task.
- `GET /{taskID}` to pull real-time streaming chunks.
- `POST /{taskID}/cancel` for graceful shutdown if the client disconnects or interrupts.

### 2. Intelligent Intent Detection (The Router)

The most fascinating part of a Multi-Agent system is **Routing**. When a user speaks, how do we know which Agent should respond?

I implemented an **Intent Detection layer** that acts as the front controller. For instance, if a user asks a highly analytical question, the router seamlessly forwards the context to "XiaoShuai" (the analytical agent). If the user needs creative assistance or empathy, the stream is routed to "XiaoMei". 

This is all done on the fly without breaking the SSE (Server-Sent Events) connection.

## Why Golang?

When building AI wrappers, most people default to Python. However, for a real-time Agent router, **Golang** is vastly superior:
1. **Goroutines**: We can spawn a separate goroutine for the OpenAI stream and another for the client connection, communicating perfectly via Channels.
2. **TRPC Ecosystem**: By leveraging `trpc-go` (Tencent's RPC framework), the server achieves microsecond latency in intra-service communication.
3. **Memory Safety**: Long-running WebSocket or SSE connections are notorious for memory leaks. Go's garbage collector and strict typing make the `A2AServer` rock solid in production.

### Goroutine Streaming Pattern

Here is a simplified architectural pattern of how the A2A server handles streaming without blocking the main thread:

```go
func (s *A2AServer) HandleStream(taskID string, ch chan<- []byte) {
    // 1. Spawns a background worker for the LLM stream
    go func() {
        defer close(ch)
        stream, err := s.llmClient.CreateChatCompletionStream(context.Background(), req)
        
        for {
            response, err := stream.Recv()
            if errors.Is(err, io.EOF) {
                break
            }
            
            // 2. Non-blocking channel write to the client
            select {
            case ch <- []byte(response.Choices[0].Delta.Content):
            case <-s.ctx.Done():
                return // Handle graceful shutdown
            }
        }
    }()
}
```

This ensures that even if an agent is generating a massive response, the HTTP worker pool is never starved, and memory footprint remains flat.

## Deployment & The Future

The entire infrastructure is dockerized and can be deployed with a single `docker run`. 

Currently, the agents communicate via text, but the next evolution of this A2A server is injecting **Real-time WebRTC Audio**. Imagine "XiaoMei" and "XiaoShuai" having a real-time voice debate over your architecture diagram, dynamically interrupting each other based on Voice Activity Detection (VAD).

The future of AI isn't just a smarter chatbot. It's a boardroom of specialized agents, and a high-performance Go server is the perfect table for them to sit at.
