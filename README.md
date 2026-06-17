# Canvas App

A React + TypeScript application for visualizing service dependencies and infrastructure relationships through an interactive node-based graph interface.

## Features

* Interactive service dependency graph
* Custom service nodes with health/status indicators
* Node inspection panel for viewing service details
* Application filtering and navigation
* Responsive layout with mobile drawer support
* Light/Dark theme support
* Mock API layer powered by MSW (Mock Service Worker)
* State management with Zustand
* Built using React Flow / xyflow

---

## Tech Stack

* React 19
* TypeScript
* Vite
* Zustand
* React Flow (@xyflow/react)
* Tailwind CSS
* shadcn/ui
* MSW (Mock Service Worker)
* Lucide React

---

## Setup Instructions

### Prerequisites

* Node.js 20+
* npm

### Installation

Clone the repository:

```bash
git clone git@github.com:amosmurmu/canvas_app.git
cd canvas_app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

Build for Production

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

Type Checking or check 

```bash
npm run typecheck or npm run check 
```
---

## Deployment
 * On Vercel [canvas_app](https://canvas-app-two.vercel.app/)
   
---

## Project Structure

```text
src/
├── api/              # mock api 
├── components/
│   ├── inspector/    # Node inspection UI
│   ├── layout/       # Application layout components
│   ├── nodes/        # Custom React Flow nodes just ServiceNode for now
│   ├── theme/        # Theme related components
│   └── ui/           # shadcn/ui components
├── mocks/            # MSW handlers and worker setup
├── store/            # Zustand store
├── types/            # Shared TypeScript types
├── utils/            # Utility functions
└── assets/           # Static assets
```

---

## Key Decisions

### 1. Zustand for State Management

Zustand was chosen instead of Redux due to the relatively small application scope and simpler developer experience. It provides a lightweight global state solution without boilerplate.

### 2. MSW for API Mocking

MSW was used to simulate backend responses while keeping the frontend architecture close to a real production setup. This allows API logic to be replaced with real endpoints with minimal changes.

### 3. React Flow for Graph Rendering

React Flow provides built-in support for nodes, edges, zooming, panning, and custom node rendering, making it a suitable choice for service topology visualization.

### 4. Component-Driven Architecture

The application separates layout, graph rendering, node presentation, and inspection functionality into focused components to improve maintainability and scalability.

### 5. TypeScript-First Development

Shared types are centralized to improve type safety across the graph, store, and API layers.

---

## Known Limitations

* Data is currently mocked using MSW and is not persisted.
* Service status updates are simulated and do not reflect real infrastructure health.
* No authentication or user-specific data is implemented.
* Error handling and loading states are intentionally lightweight for the scope of the assignment.
* Large graphs may require additional optimization techniques such as virtualization or server-driven pagination.

---

## Future Improvements

* Backend integration
* Real-time service health updates
* Automatic graph layout algorithms
* Search and filtering improvements
* Persisted user preferences
* Role-based access control
* Enhanced monitoring metrics and alerts

---

## License

This project was created as a technical assessment/demo application.
