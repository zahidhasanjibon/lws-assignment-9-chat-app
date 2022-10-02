export default function Message({ justify, message }) {
  
    const color = justify === "end" ? "bg-zinc-400" : "bg-sky-500"
   
    return (
        <li className={`flex justify-${justify} my-1`}>
            <div className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${color}`}>
                <span className={`block ${justify === "end" ? "text-white" : "text-black"}`}>{message}</span>
            </div>
        </li>
    );
}
