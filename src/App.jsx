import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import "tailwindcss";
import { useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import { useEffect, useState } from "react"
function App() {
  const connection = useConnection();
  const { connect, status, error } = useConnect();
  const connectors = useConnectors();
  const { disconnect } = useDisconnect();

  const { sendTransaction, isPending, isSuccess, error:txError } = useSendTransaction();
  const [ errorMsg, setErrorMsg ] = useState();

  function shortenAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-5)}`;
  }
  useEffect(()=>{
    if (!txError) return;
    setErrorMsg(()=> {return `${txError.message.slice(0, 50)}`});
    const time = setTimeout(() => {
      setErrorMsg(null)
    }, 1000)
    return () => clearTimeout(time)
  }, [txError])

  function sendEth() {
    if (!connection.addresses?.[0]){
      setErrorMsg('No address found. Please connect your wallet.')
      const time = setTimeout(()=> {
        setErrorMsg(null)
      },1000) 
      return;
    }
  
    sendTransaction({
      to: connection.addresses[0],
      value: parseEther("0.01"),
    });
  }

  return (
    <div>
      <div className="mx-auto flex w-150 h-150 mt-20 flex-col rounded-2xl items-center bg-slate-800">
        <div className="flex flex-col bg-slate-900 rounded-xl w-120 h-80 p-5 justify-center items-center mt-10 mb-10">
          <h1 className="font-bold text-4xl">Show Connection</h1>
          <div className="flex flex-col justify-center w-100 h-60 text-xl font-thin">
            <div className="flex justify-center border-b-[0.1px] pb-1">
              <div className="pr-5">Status: {connection.status}</div>
              <div className="pl-5 border-l-[0.1px]">
                ChainId: {connection.chainId}
              </div>
            </div>
            <div className="flex justify-baseline border-b-[0.1px] p-2">
              Address: {shortenAddress(connection.addresses?.[0])}
            </div>
          </div>
          <div className="flex">
          <div>
            {connection.status === "connected" && (
              <button
                className="bg-sky-500 p-2 rounded-xl mr-5 hover:bg-sky-700"
                type="button"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            )}
            </div>
            <div>
              <button className="bg-sky-500 p-2 rounded-xl mr-5 hover:bg-sky-700" type="button" onClick={sendEth} disabled={isPending}>
                {isPending ? "Sending..." : "Send 0.01 ETH"}
              </button>
              {isSuccess && <p>Transaction sent!</p>}
             {errorMsg && <p className="flex bg-amber-50 text-black h-20 w-50 justify-center items-center">{errorMsg}</p>}
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-slate-900 p-5 rounded-xl">
          <h2 className="text-align-center">Connect Your wallet!</h2>
          <div>
            {connectors.map((connector) => (
              <button
                className="bg-sky-500 p-2 rounded-xl m-2 hover:bg-sky-700"
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))}
          </div>

          <div className="text-gray-400">{status}</div>
          <div className="text-gray-400">{error?.message}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
