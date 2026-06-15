import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='items-center justify-center'>
        <h1 className='text-3xl font-bold '>Get started</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
        </p>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>

      </div>

    </>
  )
}

export default App
