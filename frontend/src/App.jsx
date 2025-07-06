import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div data-theme="coffee">
        <div className="text-yellow-200">hello</div>
        <button class="btn btn-neutral">Neutral</button>
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <button class="btn btn-accent">Accent</button>
        <button class="btn btn-info">Info</button>
        <button class="btn btn-success">Success</button>
        <button class="btn btn-warning">Warning</button>
        <button class="btn btn-error">Error</button>
      </div>
    </>
  )
}

export default App
