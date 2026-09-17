# VPN Platform

Production-ready platform for managing VPN subscriptions and a distributed network of VPN nodes.

The system combines a React admin panel, Node.js backend, Telegram bot, TypeScript node agent and Xray-based infrastructure. It is deployed across **8 VPN nodes** with different routes and connection protocols.

## What the system does

- creates, activates and revokes VPN subscriptions;
- manages users and access periods;
- distributes configuration changes across VPN nodes;
- monitors node availability through heartbeat messages;
- supports gift and referral links;
- activates subscriptions after payment;
- provides user flows through a Telegram bot;
- manages Xray users without manual server configuration;
- routes traffic through different servers and protocols.

## Architecture

```text
React Admin Panel ─┐
Telegram Bot ──────┼──> Node.js API ──> PostgreSQL
Payment Flow ──────┘         │
                              │ WebSocket
                     ┌────────┴────────┐
                     │ TypeScript Agent│ × 8 nodes
                     └────────┬────────┘
                              │ gRPC
                            Xray
```

The central backend stores users, subscriptions, payments and node state. Each server runs a custom TypeScript agent that maintains a WebSocket connection with the backend and applies commands to Xray through its API.

## Node agent

The custom agent is responsible for:

- registration and authorization of a node;
- heartbeat and system information reporting;
- user synchronization;
- adding and removing Xray users;
- configuration restart and reconciliation;
- communication with the Xray gRPC API;
- recovery after connection loss.

Shared contracts and command types are extracted into the `vpn_common` package.

## Repository structure

| Directory | Responsibility |
| --- | --- |
| `frontend` | React and TypeScript administration interface |
| `backend` | REST API, business logic, database and node orchestration |
| `tg_bot` | Telegram user flows and subscription management |
| `vpn_node_agent` | TypeScript agent installed on VPN nodes |
| `vpn_common` | Shared types and messaging contracts |
| `nginx` | Reverse proxy configuration |

## Tech stack

**Frontend:** React, TypeScript, Vite, React Router, Axios, Tailwind CSS  
**Backend:** Node.js, Express, TypeScript, PostgreSQL, Sequelize, JWT  
**Infrastructure:** Xray, VLESS, REALITY, WebSocket, gRPC, Docker Compose, Nginx, Linux  
**Automation:** GitHub Actions, GitHub Container Registry, SSH deployment  
**Bot:** Telegram Bot API

## CI/CD and deployment

Every push to `main` starts the production pipeline:

1. GitHub Actions builds separate Docker images for the backend, frontend and Telegram bot.
2. Images are pushed to GitHub Container Registry.
3. Production Compose and Nginx configuration are copied to the server.
4. The server pulls the new images and restarts the services through Docker Compose.

This reduced a manual deployment from approximately **20 minutes to 1–2 minutes**.

## Current status

The platform is deployed and used in production. Development continues: the current priorities are critical-path tests, operational monitoring and further node automation.

## Author

Designed and implemented by [Daniil Chabanov](https://github.com/DanikChub): architecture, frontend, backend, Telegram bot, node agent, infrastructure and deployment automation.
