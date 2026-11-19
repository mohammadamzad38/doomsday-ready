import { useQuery } from "@tanstack/react-query";
import api from "./services/api";

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["server-health"],
    queryFn: async () => {
      const response = await api.get("/");
      return response.data;
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Doomsday Ready</h1>

        <p className="text-slate-400">Your MCU rewatch journey starts here.</p>

        {isLoading && <p>Connecting to backend...</p>}

        {isError && <p className="text-red-400">Backend connection failed.</p>}

        {data && <p className="text-green-400">Backend connected: {data}</p>}
      </div>
    </main>
  );
}

export default App;
